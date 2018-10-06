# Newzapp 

This app utilizes a service worker to allow for offline viewing and asset caching
It utilizes the [News API](https://newsapi.org/docs) to display current headlines to
the user, and if the user is offline or otherwise has no access to the network, the user
either sees a message telling them to retry once they have internet access, or allows them
to continue to view news headlines that the network has already received and put into
the cache.

Check out the [demo](https://gjcarrow.github.io/newzapp) and play around with your connectivity to the internet so that you can see how it all works.
