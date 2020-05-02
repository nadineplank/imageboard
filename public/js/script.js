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
                comments: [],
                leftId: null,
                rightId: null
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
            closeModal: function() {
                this.$emit("close");
            },
            addComment: function(e) {
                var vueInstance = this;
                var id = this.id,
                    username = this.commentuser,
                    comment = this.comment;
                e.preventDefault();
                axios.post(`comment/${id}/${username}/${comment}`).then(res => {
                    vueInstance.comments.push(res.data);
                });
            },
            modal: function() {
                this.comments = [];
                axios.get("/images/" + this.id).then(res => {
                    if (
                        res.data.length === "" ||
                        location.hash === "#" + null
                    ) {
                        this.$emit("close");
                    } else {
                        this.username = res.data.username;
                        this.images = res.data.url;
                        this.title = res.data.title;
                        this.description = res.data.description;
                        this.leftId = res.data.left_id;
                        this.rightId = res.data.right_id;
                    }
                });
                axios.get("/comment/" + this.id).then(res => {
                    for (var i in res.data) {
                        this.comments.push(res.data[i]);
                    }
                });
            },
            previous: function() {
                var self = this;
                var id = location.hash.slice(1);

                axios.get("/images/" + id).then(res => {
                    self.username = res.data.username;
                    self.images = res.data.url;
                    self.title = res.data.title;
                    self.description = res.data.description;
                    self.leftId = res.data.left_id;
                });
            },
            next: function() {
                var id = location.hash.slice(1);

                axios.get("/images/" + id).then(res => {
                    this.username = res.data.username;
                    this.images = res.data.url;
                    this.title = res.data.title;
                    this.description = res.data.description;
                    this.rightId = res.data.right_id;
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

                // We need to use FormData to send a file to the server
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                axios
                    .post("/upload", formData)
                    .then(function(resp) {
                        vueInstance.images.unshift(resp.data);
                    })
                    .catch(function(err) {
                        console.log("err in POST /upload: ", err);
                    });
            },
            handleChange: function(e) {
                this.file = e.target.files[0];
            },

            closeMe: function() {
                ///// in here we can update the value of selectedImage
                this.selectedImage = null;
                history.replaceState(null, null, " ");
            },

            loadMore: function() {
                var lastId = this.images[this.images.length - 1].id;

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
            }
        }
    });
})();
