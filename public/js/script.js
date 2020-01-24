(function() {
    Vue.component("first-component", {
        template: "#template",
        props: ["id"],
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
            this.modal();
        },
        watch: {
            id: function() {
                // in here we want to do exactly the same as we did in mounted
                this.modal();
            }
        },
        methods: {
            nextImage: function() {
                console.log("next click worked!");
                this.$emit("next");
            },
            previousImage: function() {
                console.log("previous click worked!");
                this.$emit("previous");
            },
            closeModal: function() {
                console.log("sanity check click worked!!");
                this.$emit("close");
            },
            addComment: function(e) {
                var vueInstance = this;
                var id = this.id,
                    username = this.commentuser,
                    comment = this.comment;
                e.preventDefault();
                axios.post(`comment/${id}/${username}/${comment}`).then(res => {
                    console.log("Response from addComment: ", res);
                    vueInstance.comments.push(res.data);
                });
            },
            modal: function() {
                // another problem we need to deal with is of the user tries to go to an image that doesn't exist
                axios.get("/images/" + this.id).then(res => {
                    //we probably want to look at the response from the server
                    //if the response is a certain thing... close the modal
                    if (res.data.length === 0) {
                        this.$emit("close");
                    } else {
                        console.log("response: ", res.data);
                        this.username = res.data;
                        this.images = res.data;
                        this.title = res.data;
                        this.description = res.data;
                    }
                });
                axios.get("/comment/" + this.id).then(res => {
                    console.log("response from get Comment: ", res.data);
                    for (var i in res.data) {
                        this.comments.push(res.data[i]);
                    }
                });
            }
        }
    });

    new Vue({
        el: "#main",
        data: {
            selectedImage: location.hash.slice(1),
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            lastId: true
        },
        created: function() {
            console.log("created");
        },
        mounted: function() {
            var self = this;
            addEventListener("hashchange", function() {
                self.selectedImage = location.hash.slice(1);
            });
            console.log("mounted");
            axios.get("/images").then(res => {
                this.images = res.data;
            });
        },
        updated: function() {
            var lastId = this.images[this.images.length - 1].id;
            if (lastId <= "1") {
                this.lastId = false;
            }
        },

        methods: {
            upload: function(e) {
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
                ///// in here we can update the value of selectedImage
                this.selectedImage = null;
                history.replaceState(null, null, " ");
            },

            loadMore: function() {
                var lastId = this.images[this.images.length - 1].id;
                console.log(lastId);
                axios
                    .get("/more/" + lastId)
                    .then(res => {
                        for (let i in res.data) {
                            this.images.push(res.data[i]);
                        }
                    })
                    .catch(err => {
                        console.log("error in loadMore: ", err);
                    });
            },
            previous: function() {
                var id = this.selectedImage;
                console.log("Id for previous method:", id);
                axios.get("/previous/" + id).then(res => {
                    console.log("response: ", res.data);
                    this.username = res.data;
                    this.images = res.data;
                    this.title = res.data;
                    this.description = res.data;
                });
            },
            next: function() {
                var id = this.selectedImage;
                console.log("id for next method: ", id);
                axios.get("/next/" + id).then(res => {
                    console.log("response: ", res.data);
                    this.username = res.data;
                    this.images = res.data;
                    this.title = res.data;
                    this.description = res.data;
                });
            }
        }
    });
})();
