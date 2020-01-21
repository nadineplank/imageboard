(function() {
    new Vue({
        el: "#main",
        data: {
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
                console.log("Response: ", res.data);
                this.images = res.data;
                this.name = res.data;
            });
        },
        // updated: function() {
        //     console.log("updated", this.greetee);
        // },

        methods: {
            handleClick: function(e) {
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
                    })
                    .catch(function(err) {
                        console.log("err in POST /upload: ", err);
                    });
            },
            handleChange: function(e) {
                console.log("handleChange is running");
                console.log("file: ", e.target.files[0]);
                this.file = e.target.files[0];
            }
        }
    });
})();
