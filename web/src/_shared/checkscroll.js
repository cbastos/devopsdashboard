export default function checkScrollBar(limit, setLimit, loadingScroll) {
    window.onscroll = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !loadingScroll) {
            window.scrollTo(0, window.pageYOffset - 10);
            setLimit(limit + 10);
        }
    }
    /*let scrollInter = setInterval(() => {
    	if(document.body.clientHeight === document.body.scrollHeight) {
            setLimit(limit + 10);
            clearInterval(scrollInter);
        }
    }, 5000);*/
}