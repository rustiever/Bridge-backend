var newSceret = undefined;

module.exports.secret =function(secret) {
    newSecret = secret;
}

module.exports.AuthSecret =function(){
    if(newSecret)
    return newSecret;
    else
    return null;
};