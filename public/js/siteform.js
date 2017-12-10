let Developer = new Vue({
    el: '#app',
    data: {
        sitePost: {
            name: '',
            password: '',
            email: '',
            toSpend: '',
            timeline: '',
            purpose: '',
            features: '',
        },
        
    },
    methods: {
        createSitePost: function(evt) {
            evt.preventDefault();
            $.post('/new-site', {newSitePost: this.sitePost}, function(datafromserver){
                console.log("Post to /new-site a success!")
            })
        },
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            this.sitePost.purpose = files[0];
        },
        removeImage: function (e) {
            this.sitePost.picture = '';
        },
    }
});