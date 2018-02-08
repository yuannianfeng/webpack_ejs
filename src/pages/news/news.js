/**
 * Created by Administrator on 2018/2/8 0008.
 */
import './news.less'
import news from './news.ejs'

function NewsApp() {
    console.log(document.getElementById('newsPage'))
    let app = document.getElementById('newsPage');
    app.innerHTML = news();
}

new NewsApp();

