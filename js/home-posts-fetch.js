$(document).ready(function() {
    (function() {
        //get all categories
        db.collection("categories")
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    let html = `<option value="${doc.data().cat}">${
            doc.data().cat
          }</option>`;
                    $("#cat-select").append(html);
                    $("#author-interest").append(html);
                });
            })
            .catch(function(error) {});
        //get all posts from firebase database
        db.collection("blogPosts")
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    postsData(doc.data(), doc.id);
                });
            })
            .catch(function(error) {
                console.log(error);
            });
    })();

    //Home page category button
    $("#cat-select").on("change", function() {
        let buttonId = $("#cat-select option:selected").attr("value");

        $(".posts-row").empty();
        $(
            '<div class="text-center"><img src="https://i.pinimg.com/originals/58/4b/60/584b607f5c2ff075429dc0e7b8d142ef.gif"/ class="img-fluid loader text-center"></div>'
        ).insertBefore(".posts-row");

        if (buttonId == "all") {
            getAllPosts();
        } else {
            getParitcularPosts(buttonId);
        }
    });

    //blog-posts-redirect
    $(document).on("click", ".blog-post-card-inner-container", function() {
        let postId = $(this).attr("id");
        window.location.href = `blog-post-view.html?post-id=${postId}`;
    });

    //fetch all posts from the database
    function getAllPosts() {
        db.collection("blogPosts")
            .get()
            .then((data) => {
                data.forEach(async(data) => {
                    console.log(data.data());
                    let postHtml = `  <div class="col-md-4">
            <div class="blog-post-card-inner-container" id="${data.id}">

                <div class="blog-post-image-container">
                    <img src="${data.data().imageUrl}" alt="${
            data.data().title
          } image" class="img-fluid
                            blog-card-image">
                </div>
                <div class="blog-posted-date-container">
                    <div class="blog-posted-date-icon">
                    <span class="blog-post-category">${
                      data.data().category
                    }</span>
                    </div>
                </div>
                <div class="blog-card-content-container">
                    <h2 class="blog-post-title">${data.data().title}</h2>

                    <div class="blog-card-extra-info">

                    `;
                    await db
                        .collection("author")
                        .doc(data.data().authorId)
                        .get()
                        .then((doc) => {
                            postHtml += `<span class="author-name">by ${
                doc.data().name
              }</span>`;
                        });

                    postHtml += `
                        <span class="post-views">${
                          data.data().postViews
                        }  <img src="../assets/icons8-eye-24.png"/ class="views-icon"> </span>
                      
                    </div>
                </div>
            </div>
        </div>`;
                    $(".loader").hide();
                    $(".posts-row").append(postHtml);
                });
            });
    }

    //fetch particluar poasts base on user 🔠
    function getParitcularPosts(buttonId) {
        console.log(buttonId);
        db.collection("blogPosts")
            .where("category", "==", buttonId)
            .get()
            .then((data) => {
                data.forEach(async(data) => {
                    var postHtml = `  <div class="col-md-4">
                <div class="blog-post-card-inner-container" id="${data.id}">
                    <div class="blog-post-image-container">
                        <img src="${data.data().imageUrl}" alt="${
            data.data().title
          } image" class="img-fluid
                                blog-card-image">
                    </div>
                    <div class="blog-posted-date-container">
                        <div class="blog-posted-date-icon">
                            <img src="assets/date-feather-bookmark.svg" alt="Blog card date hoding icon" class="img-fluid date-icon">
                            <p class="posted-date-month mb-0">May</p>
                            <p class="posted-date-date mb-0">11</p>
                        </div>
                    </div>
                    <div class="blog-card-content-container">
                        <span class="blog-post-category">${
                          data.data().category
                        }</span>
                        <h2 class="blog-post-title">${data.data().title}</h2>
                        <div class="blog-card-extra-info">`;
                    await db
                        .collection("author")
                        .doc(data.data().authorId)
                        .get()
                        .then((doc) => {
                            postHtml += `<span class="author-name">by ${
                doc.data().name
              }</span>`;
                        });
                    postHtml += `
                            <span class="post-views">${
                              data.data().postViews
                            } <img src="../assets/icons8-eye-24.png"/ class="views-icon"></span>
                            
                        </div>
                    </div>
                </div>
            </div>`;
                    $(".loader").hide(); //hide the loader
                    $(".posts-row").append(postHtml); //append
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    //display each posts in home 📄
    async function postsData(data, id) {
        var postHtml = `  <div class="col-md-4">
        <div class="blog-post-card-inner-container" id="${id}">

            <div class="blog-post-image-container">
                <img src="${data.imageUrl}" alt="${data.title} image" class="img-fluid
                        blog-card-image">
            </div>
            <div class="blog-posted-date-container">
                <div class="blog-posted-date-icon">
                
                </div>
            </div>
            <div class="blog-card-content-container">
            <span class="blog-post-category p-0">${data.category}</span>
                <h2 class="blog-post-title">${data.title}</h2>
                

                <div class="blog-card-extra-info">

                `;

        await db
            .collection("author")
            .doc(data.authorId)
            .get()
            .then((doc) => {
                postHtml += `
                
                <span class="author-name">by ${doc.data().name}</span>`;
            });

        postHtml += `
                   
                    <span class="post-views">${data.postViews} <img src="../assets/icons8-eye-24.png"/ class="views-icon"></span>
                    

                </div>
            </div>
        </div>
    </div>`;

        $(".posts-row").append(postHtml);
        // console.log(postHtml);
    }
});