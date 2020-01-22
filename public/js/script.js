(function() {
    Vue.component("first-component", {
        template: "#template",
        props: ["postTitle", "id"],
        data: function() {
            return {
                name: "Nadine",
                count: 0
            };
        },
        mounted: function() {
            console.log("component mounted: ");
            console.log("my postTitle: ", this.postTitle);
            console.log("id: ", this.id);
        },
        methods: {
            closeModal: function() {
                console.log("sanity check click worked!!");
                this.$emit("close", this.count);
            }
        }
    });

    new Vue({
        el: "#main",
        data: {
            selectedFruit: null,
            images: null,
            name: null,
            title: "",
            description: "",
            username: "",
            file: null,
            fruits: [
                {
                    title: "🥝",
                    id: 1
                },
                {
                    title: "🍓",
                    id: 2
                },
                {
                    title: "🍋",
                    id: 3
                }
            ]
        },
        created: function() {
            console.log("created");
        },
        mounted: function() {
            console.log("mounted");
            axios.get("/images").then(res => {
                this.images = res.data.reverse();
                this.name = res.data;
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
            closeMe: function(count) {
                console.log("i need to close the modal ", count);
                ///// in here we can update the value of selectedFruit
                this.selectedFruit = null;
            }
        }
    });
})();
