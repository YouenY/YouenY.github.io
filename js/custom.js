/* 站点运行时间 */
function runtime() {
	window.setTimeout("runtime()", 1000);
	/* 请修改这里的起始时间 */
    let startTime = new Date('04/07/2022 12:20');
    let endTime = new Date();
    let usedTime = endTime - startTime;
    let days = Math.floor(usedTime / (24 * 3600 * 1000));
    let leavel = usedTime % (24 * 3600 * 1000);
    let hours = Math.floor(leavel / (3600 * 1000));
    let leavel2 = leavel % (3600 * 1000);
    let minutes = Math.floor(leavel2 / (60 * 1000));
    let leavel3 = leavel2 % (60 * 1000);
    let seconds = Math.floor(leavel3 / (1000));
    let runbox = document.getElementById('run-time');
    runbox.innerHTML = 'This site has run for <i class="far fa-clock fa-fw"></i> '
        + ((days < 10) ? '0' : '') + days + ' days '
        + ((hours < 10) ? '0' : '') + hours + ' hours '
        + ((minutes < 10) ? '0' : '') + minutes + ' minutes '
        + ((seconds < 10) ? '0' : '') + seconds + ' seconds ';
}
runtime();