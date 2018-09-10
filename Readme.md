<h4>REDUX-JSON-MIDDLEWARE is a middle ware for processing json objects that can be used to process a json object before <br>being passed to the reducer.</h4>


<br>To use it you should attach following properties with the action object passed to the dispatch :<br>

<ul>
<li><b>payload</b> : holds json object that you want to proceed and also it can be a promise that resolve a json object </li>
<li><b>jsonProperty</b> : holds the name of the property (in the resolved object ) that holds json object and that in case of passing promise to the payload</li>

<li><b>filter </b> : Arrays that holds properties names (name should start from the root) that you want to include or execlude from the json object </li>
</ul>

This middleware has three formats which are cjs,umd and es .<br>Please review examples folder to get how it is used
