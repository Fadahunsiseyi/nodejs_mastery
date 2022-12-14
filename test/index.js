

//Overrides the NODE_ENV variable

process.env.NODE_ENV = 'testing'


//Application for the test runner

_app ={}


//Container for the tests

_app.tests = {}


//Add on the unit tests

_app.tests.unit = require('./unit')
_app.tests.api = require('./api')


_app.countTests = () =>{
    let counter = 0
    for(let key in _app.tests){
        if(_app.tests.hasOwnProperty(key)){
            const subTests = _app.tests[key]
            for(let testName in subTests){
                if(subTests.hasOwnProperty(testName)){
                    counter += 1
                }
            }
        }
    }
    return counter
}

_app.runTests = () =>{
    let errors = []
    let success = 0
    const limit = _app.countTests()
    let counter = 0
    for(let key in _app.tests){
        if(_app.tests.hasOwnProperty(key)){
            const subTests = _app.tests[key]
            for(let testName in subTests){
                if(subTests.hasOwnProperty(testName)){
                    (()=>{
                        const tmpTestName = testName
                        const testValue = subTests[testName]
                        try {
                            testValue(()=>{
                                console.log('\x1b[32m%s\x1b[0m', tmpTestName)
                                counter += 1
                                success += 1
                                if(counter == limit){
                                    _app.produceTestReport(limit,success,errors)
                                }
                            })
                        } catch (error) {
                            errors.push({
                                'name': testName,
                                'error':error
                            })
                            console.log('\x1b[31m%s\x1b[0m',tmpTestName)
                            counter += 1
                            if(counter == limit){
                                _app.produceTestReport(limit,success,errors)
                            }
                        }
                    }) ()
                }
            }
        }
    }
    return counter
}

_app.produceTestReport = (limit,success,errors) =>{
    console.log("")
   console.log('-------- BEGIN TEST REPORT------------')
   console.log("")
   console.log("Total Tests: ",limit)
   console.log("Pass: ",success)
   console.log("Failed Tests: ",errors.length)
   console.log("")

   if(errors.length > 0){
    console.log("---------BEGIN ERROR DETAILS------------")
    console.log("")
    errors.forEach((testError)=>{
        console.log('\x1b[31m%s\x1b[0m',testError.name)
        console.log(testError.error)
    })
    console.log("")
    console.log("---------END ERROR DETAILS------------")
   }

   console.log("")
   console.log("---------END TEST REPORT------------")
   process.exit(0)
}



_app.runTests()