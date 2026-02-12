**For Reflected XSS**
**Process of creation:**
* Hosted a reflected XSS site in nginx and created a simple docker to package a server environment (Node.js, all its dependencies, and specific server code) into a single "container".
* Nginx free service only provided with one free hosting link which is why I have merged the victim's website and attacker's server in the same page
* A HTML page was created which joins the invite.html to victim_server after which the reflected XSS will be triggered
* Used the "https://developer.mozilla.org/en-US/docs/Web/API" media API as a script that was passed in the URL
