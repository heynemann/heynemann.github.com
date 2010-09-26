$(function() {

    var feeds = [
        {
            url: 'http://github.com/heynemann.atom',
            template: '#entry_template',
            container: '.projects-feed > .content',
            maxEntries: 15,
            type: 'rss'
        },
        {
            url: 'http://blog.heynemann.com.br/feed/',
            template: '#entry_template',
            container: '.blog-feed > .content',
            maxEntries: 10,
            type: 'rss'
        },
        {
            url: 'heynemann',
            template: '#tweet_template',
            container: '.twitter-feed > .content',
            maxEntries: 20,
            type: 'twitter'
        }
    ];

    $.each(feeds, function() {
        var feed = this;
        var container = $(feed.container);

        if (feed.type == "rss") {
            loadRssFeed(feed, container);
        } else {
            loadTwitterFeed(feed, container);
        }
    });

    function loadTwitterFeed(feed, container) {
        $.jTwitter(feed.url, feed.maxEntries, function(data){
            $.each(data, function(){
                var entry = this;

                var body = entry.text;
                var date = dateFor(entry.created_at);
                var to = entry.in_reply_to_screen_name;
                var retweets = entry.retweeted ? parseInt(entry.retweet_count) : 0;

                var template = $(feed.template).clone();
                template.attr('id', '');

                template.find('.tweet-body').html(body);

                var dateElement = template.find('.tweet-date').find('abbr');
                dateElement.attr('title', entry.created_at);
                dateElement.html(date);

                template.find('.tweet-retweet').html(retweets + ' retweets');

                if (to) {
                    var toLink = $('<a class="tweet-user"></a>');
                    toLink.attr('href', 'http://twitter.com/' + to);
                    toLink.html('@' + to)

                    var tweetTo = template.find('.tweet-to')
                    tweetTo.append(toLink);
                } else {

                }

                container.append(template);
                $('abbr.timeago').timeago();
            });
            $(feed.template).remove();
        });
    }

    function loadRssFeed(feed, container) {

        $.jGFeed(feed.url,
            function(feeds){
                if(!feeds){
                    return false;
                }

                $.each(feeds.entries, function() {
                    var entry = this;

                    var template = $(feed.template).clone();
                    template.attr('id', '');

                    var title = template.find('.entry-title').find('a');
                    title.attr('href', entry.link);
                    title.html(entry.title);

                    var entryDate = dateFor(entry.publishedDate);
                    var date = template.find('.entry-date').find('abbr');
                    date.attr('title', entryDate);
                    date.html(entry.publishedDate);

                    template.find('.entry-body').html(entry.contentSnippet);

                    container.append(template);
                    $('abbr.timeago').timeago();
                });
            },
        feed.maxEntries);
    }

    function dateFor(date) {
        var timestamp  = Date.parse(date);
        var dateObj = new Date(timestamp);

        var formattedDate = dateObj.getFullYear() + "-" +
                            (dateObj.getMonth() + 1) + "-" +
                            dateObj.getDate() + "T" +
                            dateObj.getHours() + ":" +
                            dateObj.getMinutes() + ":" +
                            dateObj.getSeconds() + "Z";
        return formattedDate;
    }

    function maxLength(text) {
        var max = 30;
        if (text.length > max) {
            return text.substr(0, max - 3) + '...';
        }

        return text;
    }

});