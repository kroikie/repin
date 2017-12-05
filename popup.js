// Pin the user's saved tabs. Tabs will only be pinned if not currently pinned.
function load() {
    console.log('pinning currently saved tabs');
    chrome.tabs.query(
        {
            "pinned": true
        },
        function(currentlyPinnedTabs) {
            console.log(currentlyPinnedTabs);
            chrome.storage.sync.get('pinned', function(pinned) {
                var pinnedTabs = pinned['pinned'];
                for (var i = 0; i < pinnedTabs.length; i++) {
                    // Only pin a tab if it is not already pinned.
                    if (!isPinned(currentlyPinnedTabs, pinnedTabs[i])) {
                        chrome.tabs.create({
                            "url": pinnedTabs[i],
                            "pinned": true
                        },
                        function() {
                            console.log('tab created');
                        });
                    }
                }
            });
        }
    );
}

// Save currently pinned tabs to user's storage.
function save() {
    console.log('saving currently pinned tabs');
    chrome.tabs.query(
        {
            "pinned": true
        },
        function(pinnedTabs) {
            // Only replace the current set of pinned tabs if pinned tabs exist.
            if (pinnedTabs.length > 0) {
                var pinned = [];
                for (var i = 0; i < pinnedTabs.length; i++) {
                    pinned.push(pinnedTabs[i].url);
                }
                chrome.storage.sync.set({'pinned': pinned}, function() {
                    console.log('pinned tabs saved');
                });
            }
        }
    );
}

// Check if the url is currently opened in a tabs.
function isPinned(tabs, url) {
    console.log('checking if already pinned');
    for (var i = 0; i < tabs.length; i++) {
        var tabUrl = tabs[i].url;
        if (tabUrl == url) {
            console.log('tab is currently pinned');
            return true;
        }
    }
    console.log('tab is not pinned');
    return false;
}

// Add click listeners for the load and save buttons.
document.addEventListener('DOMContentLoaded', function () {
    console.log('loaded');
    document.getElementById('saveButton').addEventListener('click', function(e) {
        save();
    });

    document.getElementById('loadButton').addEventListener('click', function(e) {
        load();
    });
});