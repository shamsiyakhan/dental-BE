const uuid4 = require('uuid4');

function generateUniqueId() {
    const uniqueId = uuid4().replace(/-/g, '').substring(0, 20);
    return uniqueId;
}

//console.log(generateUniqueId());


generateUniqueId()


module.exports=generateUniqueId()
