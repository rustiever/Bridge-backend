const converter=csv()
.fromFile('../dummyAssets/MOCK_DATA.csv')
.then((json)=>{
    console.log(json);
    return true;
});
console.log(converter);