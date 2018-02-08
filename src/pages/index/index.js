/**
 * Created by Administrator on 2018/2/8 0008.
 */
import './index.less'
import index from './index.ejs'

$(function () {
    function Index() {
        return {
            name:'index',
            index:index
        }
    }
    function IndexApp() {
        let app = document.getElementById('indexPage');

        //请求传入数据
        // $.post("/api/student/login",function(data,status){
        //     console.log(data)
        //     app.innerHTML = index({
        //         student:data.student
        //     });
        // });
        app.innerHTML = index();
    }
    new IndexApp();
})


