let Developer = new Vue({
    el: '#app',
    data: {
        sitePost: {
            name: 'Django',
            password: 'unchained',
            email: 'kill@whitepeople.com',
            toSpend: '999',
            timeline: '04/26/1985',
            date: '',
            purpose: '',
            features: '',
        },
        
    },
    methods: {
        createSitePost: function(evt) {
            evt.preventDefault();
            this.sitePost.date = new Date(this.sitePost.timeline)
            var formatDate = function(date) {
                var monthNames = [
                    "January", "February", "March",
                    "April", "May", "June", "July",
                    "August", "September", "October",
                    "November", "December"
                ];
                var day = date.getDate();
                var monthIndex = date.getMonth();
                var year = date.getFullYear();
                return monthNames[monthIndex]  + ' ' + day + ' ' + year;
            }
            this.sitePost.date = formatDate(this.sitePost.date)
            console.log(this.sitePost.date)
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