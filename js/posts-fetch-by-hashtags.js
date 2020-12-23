$(document).ready(function() {
    const queryString = window.location.search; //accessing the url object from window
    const urlSearchParms = new URLSearchParams(queryString); // fetching the postid from the url querystring

    //logic to get post id from the url
    if (urlSearchParms.has("hashtag")) {
        const hashtagFromUrl = urlSearchParms.get("hashtag");
        fetchpostsfromdatabase(hashtagFromUrl);
    }

    //blog-posts-redirect
    $(document).on("click", ".blog-post-card-inner-container", function() {
        let postId = $(this).attr("id");
        window.location.href = `blog-post-view.html?post-id=${postId}`;
    });

    // all function code starts from here
    function fetchpostsfromdatabase(hashtag) {
        db.collection("blogPosts")
            .where("hashTags", "==", hashtag)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(async function(data) {
                    let postHtml = `  <div class="col-md-6">
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
                        } <img src="../assets/icons8-eye-24.png"/ class="views-icon"></span>
                    </div>
                </div>
            </div>
        </div>`;

                    $(".posts-row").append(postHtml);
                });
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
    }
});