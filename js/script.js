$(document).ready(function() {
    var options = {
        bottom: "64px", // default: '32px'
        right: "32px", // default: '32px'
        left: "unset", // default: 'unset'
        time: "0.5s", // default: '0.3s'
        mixColor: "#fff", // default: '#fff'
        backgroundColor: "#fff", // default: '#fff'
        buttonColorDark: "#100f2c", // default: '#100f2c'
        buttonColorLight: "#fff", // default: '#fff'
        saveInCookies: false, // default: true,
        label: "🌓", // default: ''
        autoMatchOsTheme: true, // default: true
    };

    const darkmode = new Darkmode(options);
    darkmode.showWidget();

    //save write for us modal information to database

    document
        .querySelector(".modal-submit-button")
        .addEventListener("click", function(e) {
            e.preventDefault();

            let userName = document.querySelector("#name").value;
            let authorInterest = document.querySelector("#author-interest").value;
            let userEmail = document.querySelector("#email").value;
            let userContact = document.querySelector("#contact").value;
            let userMessage = document.querySelector("#message").value;

            if (
                userName != "" &&
                authorInterest != "" &&
                userEmail != "" &&
                userContact != "" &&
                userMessage != ""
            ) {
                db.collection("authorInterests")
                    .add({
                        name: userName,
                        interest: authorInterest,
                        email: userEmail,
                        contact: userContact,
                        message: userMessage,
                    })
                    .then((res) => {
                        document.querySelector(".modal-form").reset();
                        $(".modal-form").hide();
                        $(".response-block").show();
                    });
            }
        });
});