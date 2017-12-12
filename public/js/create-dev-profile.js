let Developer = new Vue({
    el: '#app',
    data: {
        newDev: {
            username: 'Dan_Schmidt',
            password: 'locomotives',
            name: 'Dan Schmidt',
            portfolioSite: 'schmidty.com',
            description: 'Full stack web developer with two years experience',
            file: '',
        },
        
    },
    methods: {
        createProfile: function(evt) {
            var that = this;
            evt.preventDefault();
            var files = evt.target.files;

            var vm = this;
            let formData = new FormData();
            formData.append('username', this.newDev.username);
            formData.append('password', this.newDev.password);
            formData.append('name', this.newDev.name);
            formData.append('portfolioSite', this.newDev.portfolioSite);
            formData.append('description', this.newDev.description);
            formData.append('file', this.newDev.file);
            $.ajax({
              url: '/new-dev',
              method: 'POST',
              data: formData,
              contentType: false,
              processData: false,
            }).done(function(datafromserver){
                console.log("Post to /new-dev a success!")
              })
        },
        
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            this.newDev.file = files[0];
        },
        removeImage: function (e) {
            this.newDev.picture = '';
        },
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            this.newDev.file = files[0];
        },
        removeImage: function (e) {
            this.newDev.picture = '';
        },
    }
});