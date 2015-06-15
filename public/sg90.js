/********************************
* node.js + socket.io��netduino plus�Ɍq�������T�[�{���[�^�[�𓮂����B
* 2015/06/15�@7M4MON
* ���l�^�@http://blog.fenrir-inc.com/jp/2011/06/ios_android_pc_touchevent.html
*********************************/

/* �^�b�`�ł�����Ȃ� true�A�����łȂ��Ȃ� false �B
   �����Ő�ɔ��ʂ��Ă����܂��B */
var isTouch = ('ontouchstart' in window);
var xPos;
var yPos;
var socket = io();
var lastTime = new Date();

/* hoge �̃C�x���g�� jQuery.bind �ŕߊl���܂��B */
$('#Enter').bind({
    
    /* �^�b�`�̊J�n�A�}�E�X�{�^�����������Ƃ� */
    'touchstart mousedown': function(e) {
        // �y�[�W����������A�������~�߂�
        e.preventDefault();
         
        // �J�n�ʒu X,Y ���W���o���Ă���
        // �itouchmove �C�x���g��ʂ炸�I�������Ƃ��̂��߂ɕK���o���Ă������Ɓj
        this.pageX = (isTouch ? event.changedTouches[0].pageX : e.pageX);
        this.pageY = (isTouch ? event.changedTouches[0].pageY : e.pageY);
 
        // ���݂� hoge �̏ꏊ���o���Ă���
        this.left = $(this).position().left;
        this.top = $(this).position().top;
         
        // �^�b�`�������J�n�����t���O�����Ă�
        this.touched = true;
    },
    /* �^�b�`���Ȃ���ړ��A�}�E�X�̃h���b�O */
    'touchmove mousemove': function(e) {
    
         
        // �J�n���Ă��Ȃ��ꍇ�͓����Ȃ��悤�ɂ���
        // �ߏ蓮��̖h�~
        if (!this.touched) {
            return;
        }
         
        // �y�[�W�������̂��~�߂�
        e.preventDefault();
         
        
        /*
        // �ړ���� hoge �̈ʒu���擾����
        this.left = this.left - (this.pageX - (isTouch ? event.changedTouches[0].pageX : e.pageX) );
        this.top = this.top - (this.pageY - (isTouch ? event.changedTouches[0].pageY : e.pageY) );
 		*/
        // hoge ���ړ�������
        //$(this).css({left:this.left, top:this.top});
         
        // �ʒu X,Y ���W���o���Ă���
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
        
        if (new Date() - lastTime > 200){	//�R�}���h�𓊂���C���^�[�o��(msec)
        
	        
	        sendmsg = 'SETPULSE D5 20000 ' + xPos + '\r\n';
	        socket.emit('sendmsg',sendmsg);
	        //Sleep(100);	//�g�p�����android�̃u���E�U��������
	    	sendmsg = 'SETPULSE D9 20000 ' + yPos + '\r\n';
	        socket.emit('sendmsg',sendmsg);
	    	//Sleep(100);	//�g�p�����android�̃u���E�U��������
	    	lastTime = new Date();
    	}
    	
        
    },
    /* �^�b�`�̏I���A�}�E�X�̃h���b�O�̏I�� */
    'touchend mouseup': function(e) {
        if (!this.touched) {
            return;
        }
         
        // �^�b�`�����͏I���������߁A�t���O��������
        this.touched = false;
         
        // �K�v�Ȃ�ȉ��ōŏI�� hoge �̈ʒu���擾�������Ɏg��
        // this.pageX
        // this.pageY
    }
});

// ���ǎg���ĂȂ��B
function Sleep( milli_second )
{
    var start = new Date();
    while( new Date() - start < milli_second );
}
