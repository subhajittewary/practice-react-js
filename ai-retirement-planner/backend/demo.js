var unusedVariable = 42 // Issue 1: Unused variable, Issue 2: Missing semicolon

function demoFunction() {  
    console.log("This is a demo function") // Issue 3: Console statement
    var x = 10  // Issue 4: Use of var instead of let/const
    return x     
} // Issue 5: Trailing spaces