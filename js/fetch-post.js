$(document).ready(function() {
    var authorName;
    (function() {
        const queryString = window.location.search;
        const urlSearchParms = new URLSearchParams(queryString);

        if (urlSearchParms.has("post-id")) {
            const blogPostId = urlSearchParms.get("post-id");

            if (localStorage.getItem(blogPostId) != null) {
                console.log("from local");
                let postDataFromLocalStorage = localStorage.getItem(blogPostId);
                renderPost(JSON.parse(postDataFromLocalStorage), blogPostId);
            } else {
                console.log(blogPostId);

                db.collection("blogPosts")
                    .doc(blogPostId)
                    .get()
                    .then((postData) => {
                        if (postData.data() == undefined) {
                            $(".loader").hide();
                            $(".post-not-found-section").show();
                        }
                        renderPost(postData, blogPostId);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }

            //update post views on click
            db.collection("blogPosts")
                .doc(blogPostId)
                .get()
                .then(function(data) {
                    db.collection("blogPosts")
                        .doc(blogPostId)
                        .update({
                            postViews: Number(data.data().postViews) + 1,
                        })
                        .then((message) => {
                            console.log("updated successfully");
                        });
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    })();

    async function renderPost(post, id) {
        $(
            '<div class="text-center"><img src="https://i.pinimg.com/originals/58/4b/60/584b607f5c2ff075429dc0e7b8d142ef.gif"/ class="img-fluid loader text-center"></div>'
        ).insertBefore(".blog-post-append-container");
        //  console.log(post);
        var postHtml = `
            <div class="col-md-9 offset-2">
            <h2 class="blog-post-detailed-title">${post.data().title}</h2>
            
            <div class="blog-post-detailed-image-container">
            <span class="category float-right">${post.data().category}</span>
                <img src="${post.data().imageUrl}" alt="${
      post.data().title
    }" class="img-fluid">
            </div>

            <div class="blog-post-detailed-content">
                <p class="blog-content-paragraph">
                ${post.data().content}
                </p>
                <p class="blog-content-hashtags">
                <img src="../assets/hashtag.png" class="hashtag-icon"/>
                <a href="search-by-hashtags.html?hashtag=${
                  post.data().hashTags
                }" class="hashtags">${post.data().hashTags}</a>
                </p>

                <!-- Your share and like button code -->
                <iframe src="https://www.facebook.com/plugins/like.php?href=${
                  window.location.href
                }&width=87&layout=button_count&action=like&size=small&share=false&height=21&appId=228898271705984"  class="facebook-like-iframe" width="87" height="21" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>    
          </div>
        </div>

     
        <div class="author-container">
        <div class="container text-center">
            <div class="author-info-conatiner">
                <div class="row">
                    <div class="col-md-3 pr-0 w-25-mobile">`;

        await db
            .collection("author")
            .doc(post.data().authorId)
            .get()
            .then(async(author) => {
                authorName = author.data().name;
                postHtml += `
                
                <img src="${
                  author.data().imageUrl
                }" alt="Author image" class="img-fluid author-image">
                </div>
                <div class="col-md-9 text-left pl-0 w-75-mobile">
                
                    <div class="author-info">
                            <p class="author-name mb-0">${
                              author.data().name
                            }</p>
                            <p class="posted-date mb-0">Updated on ${
                              post.datePosted
                            }
                            </p>

                            <div class="author-social-container">
                            <a href="${author.data().fbUrl}" target="_blank">
                            <span><img src="../assets/Facebook-icon.svg" class="img-fluid author-social-icon" />
                            </span>
                            </a>
                            <a href="${
                              author.data().linkedinURL
                            }" target="_blank">
                            <span><img src="../assets/LinkedIN-icon.svg" class="img-fluid author-social-icon" />
                            </span>
                            </a>
                            <a href="${
                              author.data().twitterURL
                            }" target="_blank">
                            <span><img src="../assets/Twitter-icon.svg" class="img-fluid author-social-icon" />
                            </span>
                            </a>
                            </div>`;
            });
        postHtml += `
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Your comment button code -->
    <div class="col-md-12 text-center mt-3">
    <div class="fb-comments" data-href="${window.location.href}" data-numposts="5" data-width=""></div>  
    </div> 
        `;

        $("title").text(post.data().title);

        $("meta[property='og:title']").attr("content", post.data().title);

        $("meta[property='og:description']").attr("content", post.data().content);

        $(".loader").hide();
        $(".blog-post-append-container").append(postHtml);

        //fetch realted posts from localstorage

        // const postsLength = localStorage.length;
        // console.log(postsLength);
        // //  console.log(postsLength);

        // for (let i = 0; i < 3; i++) {
        //     let key = localStorage.key(i);
        //     let relatedPostsFromLocalStorage = JSON.parse(localStorage.getItem(key));

        //     let postsHtml = `  <div class="col-md-4">
        //     <div class="related-posts-card-container" id="${key}">
        //         <img src="${relatedPostsFromLocalStorage.imageUrl}" alt="${relatedPostsFromLocalStorage.title}" class="img-fluid
        //                 related-post-card-image">
        //     </div>
        //     <div class="related-posts-card-content-container">
        //     <span class="blog-post-category">${relatedPostsFromLocalStorage.category}</span>
        //         <p class="related-posts-card-title">${relatedPostsFromLocalStorage.title}</p>
        //         <div class="blog-card-extra-info">
        //             <span class="author-name">by ${relatedPostsFromLocalStorage.author}</span>
        //             <span class="post-views">1200 Viewed</span>
        //         </div>

        //     </div>
        // </div>`;

        //     $(".related-posts-row").append(postsHtml);
        // }

        // let limit = db.collection("blogPosts").orderBy("datePosted").limit(3).get();
        // limit.then((posts) => {
        //     posts.forEach((eachpost) => {
        //         console.log(eachpost.data());
        //     });
        // });

        db.collection("blogPosts")
            .orderBy("datePosted")
            .limit(3)
            .get()
            .then((posts) => {
                posts.forEach((eachPost) => {
                    let postsHtml = `  <div class="col-md-4">
            <div class="related-posts-card-container" id="${eachPost.id}">
                <img src="${eachPost.data().imageUrl}" alt="${
            eachPost.data().title
          }" class="img-fluid
                        related-post-card-image">
            </div>
            <div class="related-posts-card-content-container">
            <span class="blog-post-category">${eachPost.data().category}</span>
                <p class="related-posts-card-title">${eachPost.data().title}</p>
                <div class="blog-card-extra-info">
                    <span class="author-name">By ${authorName}</span>
                    <span class="post-views">${eachPost.data().postViews}</span>
                    <img src="../assets/icons8-eye-24.png"/ class="views-icon">
                </div>

            </div>
        </div>`;

                    $(".related-posts-row").append(postsHtml);
                });
            });
    }

    //click on the post
    $(document).on("click", ".related-posts-card-container", function() {
        let postId = $(this).attr("id");
        window.location.href = `blog-post-view.html?post-id=${postId}`;
    });

    //updating likes 🥥

    $(document).on("click", ".like-icon", function() {
        let postId = $(this).attr("id");

        db.collection("blogPosts")
            .doc(postId)
            .get()
            .then(function(querySnapshot) {
                updateLikes(querySnapshot.data().likes, postId);
                let likes = $(`#${postId}`).siblings("span").text();
                $(`#${postId}`)
                    .siblings("span")
                    .text(Number(likes) + 1);
            })
            .catch(function(error) {});
    });

    function updateLikes(likes, id) {
        console.log("i am called");
        db.collection("blogPosts")
            .doc(id)
            .update({
                likes: parseInt(likes) + 1,
            })
            .then(function(doc) {
                console.log(doc);
            })
            .catch(function(error) {
                console.log("unable to update like");
            });
    }
});