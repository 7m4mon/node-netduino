/********************************
* node.js + socket.ioでnetduino plusに繋がったサーボモーターを動かす。
* 2015/06/15　7M4MON
* 元ネタ　http://blog.fenrir-inc.com/jp/2011/06/ios_android_pc_touchevent.html
*********************************/

/* タッチできる環境なら true、そうでないなら false 。
   ここで先に判別しておきます。 */
var isTouch = ('ontouchstart' in window);
var xPos;
var yPos;
var socket = io();
var lastTime = new Date();

/* hoge のイベントを jQuery.bind で捕獲します。 */
$('#Enter').bind({
    
    /* タッチの開始、マウスボタンを押したとき */
    'touchstart mousedown': function(e) {
        // ページが動いたり、反応を止める
        e.preventDefault();
         
        // 開始位置 X,Y 座標を覚えておく
        // （touchmove イベントを通らず終了したときのために必ず覚えておくこと）
        this.pageX = (isTouch ? event.changedTouches[0].pageX : e.pageX);
        this.pageY = (isTouch ? event.changedTouches[0].pageY : e.pageY);
 
        // 現在の hoge の場所を覚えておく
        this.left = $(this).position().left;
        this.top = $(this).position().top;
         
        // タッチ処理を開始したフラグをたてる
        this.touched = true;
    },
    /* タッチしながら移動、マウスのドラッグ */
    'touchmove mousemove': function(e) {
    
         
        // 開始していない場合は動かないようにする
        // 過剰動作の防止
        if (!this.touched) {
            return;
        }
         
        // ページが動くのを止める
        e.preventDefault();
         
        
        /*
        // 移動先の hoge の位置を取得する
        this.left = this.left - (this.pageX - (isTouch ? event.changedTouches[0].pageX : e.pageX) );
        this.top = this.top - (this.pageY - (isTouch ? event.changedTouches[0].pageY : e.pageY) );
 		*/
        // hoge を移動させる
        //$(this).css({left:this.left, top:this.top});
         
        // 位置 X,Y 座標を覚えておく
        this.pageX = (isTouch ? event.changedTouches[0].pageX : e.pageX);
        this.pageY = (isTouch ? event.changedTouches[0].pageY : e.pageY);
        
        xPos = Math.floor(this.pageX - this.left);
        yPos = Math.floor(this.pageY- this.top);
        
        if (xPos<0) { xPos = 0 ;}
        else if (xPos>512) {xPos = 512;}
               
        if(yPos<0){yPos = 0;}
        else if (yPos>512){yPos = 512;}
        
        $('#XPosition').text(xPos);
        $('#YPosition').text(yPos);
        
        xPos = 500 + 4 * xPos;
        yPos = 500 + 4 * yPos;
        
        var sendmdg;
        
        if (new Date() - lastTime > 200){	//コマンドを投げるインターバル(msec)
        
	        
	        sendmsg = 'SETPULSE D5 20000 ' + xPos + '\r\n';
	        socket.emit('sendmsg',sendmsg);
	        //Sleep(100);	//使用するとandroidのブラウザが落ちる
	    	sendmsg = 'SETPULSE D9 20000 ' + yPos + '\r\n';
	        socket.emit('sendmsg',sendmsg);
	    	//Sleep(100);	//使用するとandroidのブラウザが落ちる
	    	lastTime = new Date();
    	}
    	
        
    },
    /* タッチの終了、マウスのドラッグの終了 */
    'touchend mouseup': function(e) {
        if (!this.touched) {
            return;
        }
         
        // タッチ処理は終了したため、フラグをたたむ
        this.touched = false;
         
        // 必要なら以下で最終の hoge の位置を取得し何かに使う
        // this.pageX
        // this.pageY
    }
});

// 結局使ってない。
function Sleep( milli_second )
{
    var start = new Date();
    while( new Date() - start < milli_second );
}
