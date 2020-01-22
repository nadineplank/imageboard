(function() {
    Vue.component("first-component", {
        template: "#template",
        props: ["postTitle", "id"],
        data: function() {
            return {
                username: "",
                images: null,
                title: "",
                description: "",
                comment: null,
                commentuser: "",
                comments: []
            };
        },
        mounted: function() {
            console.log("component mounted: ");
            console.log("my postTitle: ", this.postTitle);
            console.log("id: ", this.id);
            axios.get("/images/" + this.id).then(res => {
                console.log("response: ", res.data);
                this.username = res.data;
                this.images = res.data;
                this.title = res.data;
                this.description = res.data;
            });
            axios.get("/comment/" + this.id).then(res => {
                console.log("response from get Comment: ", res.data);
                for (var i in res.data) {
                    this.comments.push(res.data[i]);
                }
            });
        },
        methods: {
            closeModal: function() {
                console.log("sanity check click worked!!");
                this.$emit("close");
            },
            handleComment: function(e) {
                var vueInstance = this;
                var id = this.id,
                    username = this.commentuser,
                    comment = this.comment;
                e.preventDefault();
                axios.post(`comment/${id}/${username}/${comment}`).then(res => {
                    console.log("Response from handleComment: ", res);
                    vueInstance.comments.push(res.data);
                });
            }
        }
    });

    new Vue({
        el: "#main",
        data: {
            selectedImage: null,
            images: null,
            name: null,
            title: "",
            description: "",
            username: "",
            file: null
        },
        created: function() {
            console.log("created");
        },
        mounted: function() {
            console.log("mounted");
            axios.get("/images").then(res => {
                this.images = res.data.reverse();
                this.title = res.data;
            });
        },
        // updated: function() {
        //     console.log("updated", this.greetee);
        // },

        methods: {
            handleClick: function(e) {
                var vueInstance = this;
                e.preventDefault();
                console.log("this: ", this);

                // We need to use FormData to send a file to the server
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                axios
                    .post("/upload", formData)
                    .then(function(resp) {
                        console.log("resp from POST /upload: ", resp);
                        vueInstance.images.unshift(resp.data);
                    })
                    .catch(function(err) {
                        console.log("err in POST /upload: ", err);
                    });
            },
            handleChange: function(e) {
                console.log("handleChange is running");
                console.log("file: ", e.target.files[0]);
                this.file = e.target.files[0];
            },

            closeMe: function() {
                console.log("i need to close the modal ");
                ///// in here we can update the value of selectedImage
                this.selectedImage = null;
            }
        }
    });
})();
