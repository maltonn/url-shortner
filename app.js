var url_obj={}//短縮URLと元URLの情報
var double_obj={}//重複した際の連番格納
var accessed_list=[]
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser());
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {
  res.render('index',{title:'短縮URLを作成',isMade:false});
});
app.post('/done', function(req, res) {
  input_url=req.body.input_url
  if(input_url=="http://11nk.ga/get-all-links"){//セキュリティ的にかなり危ない
    res.send(url_obj);
    return;
  }else if(input_url=="http://11nk.ga/get-all-accessed-links"){
    res.send(accessed_list)
  }

  para=input_url.split('?')//裏コマンド
  if(para[para.length-1]=="length=short"){
    made_url=MakeURL(1)
  }else{
    made_url=MakeURL(4)
  }
  if(url_obj[made_url]){
    num=double_obj[made_url]
    made_url+=num
    double_obj[made_url]=num+1
    url_obj[made_url]=input_url
  }else{
    url_obj[made_url]=input_url
    double_obj[made_url]=0
  }
  res.render('index', {title:'作成完了',url:"http://11nk.ga"+made_url,isMade:true});
});

app.get('/disclaimer', function (req, res) {
  res.render('disclaimer',{title:'免責事項'})
})

app.get(/.*/, function (req, res) {
  url=url_obj[req.originalUrl]
  if(url){
    res.redirect(302,url)
    accessed_list.push(url)
  }else{
    res.render('notFound', {title:'404 not Found'});
  }
});

port=8000
app.listen(port, () => console.log('Example app listening on port '+port));

function MakeURL(n){
  alphabet=["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
  out="/"
  for (i=0;i<n;i++){
    r=Math.floor(Math.random()*26)
    out+=alphabet[r]
  }
  return out
}