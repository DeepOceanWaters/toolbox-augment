# toolbox-augment

The typescript must be compiled. The entire folder can be added as an extension by following this tutorial: https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked (load unpacked section only).

# Toolbox Augment
The majority of this extension is to update the toolbox UI, and add the ability to use Issue Templates which will auto populate: success criteria, issue description, recommendation. Some may have "$var$" text - I had planned to allow users to replace variables but simply selecting the text and replacing works fine for me now. 

Pages, Success Criteria, and States have all been replaced with a group of checkboxes. You can filter them. While the filter textbox input is focused, you can used arrow keys to move down into the group of checkboxes. Space or Enter should activate the checkbox, but I've been having some issues with Enter occasionally. 

Pages, Success Criteria, and States can also be sorted to show the currently checked checkboxes first. This automatically happens when opening a new issues so that auditors can easily see the relevant pages/sc/states.

# Ability Threshold

This also comes with a Chrome DevTools panel called "Ability Threshold" which allows you to check the color contrast of a screenshot. I typically paste a screenshot (taken on Windows by pressing windows+shift+s, then all click inside the DevTools panel and control+v to paste; Alternatively there is a file upload where you can upload an image) a magnifier should be present that allows you to pick a pixel color. Magnifier can be moved using arrow keys while it is focused, Shift+Arrow moves the magnifier a greater distance. Pressing Escape brings up the keyboard shortcuts - warning there is currently a bug and the shorcuts dialog does not close. 

Ratio input is not used currently as auditing only really cares about 3:1 and 4.5:1, and the app processes the image based on both of those thresholds.

After processing the image, there should be two images: 3:1 ratio and 4.5:1 ratio. A table will also appear containing the top 20 highest count pixel colors (helps get the background color fairly easy).
