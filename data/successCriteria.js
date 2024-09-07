/**
 * @typedef {Object} SuccessCriteria
 * @property {String} name
 * @property {String} number
 * @property {String} conformanceLevel
 * @property {String} description
 */

/** @type {SuccessCriteria} */
export const successCriteria = {
	"1.1.1": {
		"name": "Non-text Content",
		"number": "1.1.1",
		"conformanceLevel": "A",
		"description": "All non-text content that is presented to the user has a text alternative that serves the equivalent purpose, except for the situations listed below.\n   \n\n      \n      Controls, Input\n      \n      \n         \n         If non-text content is a control or accepts user input, then it has a name that describes its purpose. (Refer to Success Criterion 4.1.2 for additional requirements for controls and content that accepts user input.)\n         \n         \n      \n      \n      Time-Based Media\n      \n      \n         \n         If non-text content is time-based media, then text alternatives at least provide descriptive\n            identification of the non-text content. (Refer to Guideline 1.2 for additional requirements for media.)\n         \n         \n      \n      \n      Test\n      \n      \n         \n         If non-text content is a test or exercise that would be invalid if presented in text, then text alternatives at least provide descriptive identification of the non-text\n            content.\n         \n         \n      \n      \n      Sensory\n      \n      \n         \n         If non-text content is primarily intended to create a specific sensory experience, then text alternatives at least provide descriptive identification of the non-text\n            content.\n         \n         \n      \n      \n      CAPTCHA\n      \n      \n         \n         If the purpose of non-text content is to confirm that content is being accessed by\n            a person rather than a computer, then text alternatives that identify and describe\n            the purpose of the non-text content are provided, and alternative forms of CAPTCHA\n            using output modes for different types of sensory perception are provided to accommodate\n            different disabilities.\n         \n         \n      \n      \n      Decoration, Formatting, Invisible\n      \n      \n         \n         If non-text content is pure decoration, is used only for visual formatting, or is not presented to users, then it is implemented\n            in a way that it can be ignored by assistive technology.\n         \n         \n      \n      \n   \nControls, Input\nTime-Based Media\nTest\nSensory\nCAPTCHA\nDecoration, Formatting, Invisible"
	},
	"1.2.1": {
		"name": "Audio-only and Video-only (Prerecorded)",
		"number": "1.2.1",
		"conformanceLevel": "A",
		"description": "For prerecorded\n      audio-only and prerecorded video-only media, the following are true, except when the audio or video is a media alternative for text and is clearly labeled as such:\n   \n\n      \n      Prerecorded Audio-only\n      \n      \n         \n         An alternative for time-based media is provided that presents equivalent information for prerecorded audio-only content.\n         \n         \n      \n      \n      Prerecorded Video-only\n      \n      \n         \n         Either an alternative for time-based media or an audio track is provided that presents\n            equivalent information for prerecorded video-only content.\n         \n         \n      \n      \n   \nPrerecorded Audio-only\nPrerecorded Video-only"
	},
	"1.2.2": {
		"name": "Captions (Prerecorded)",
		"number": "1.2.2",
		"conformanceLevel": "A",
		"description": "Captions are provided for all prerecorded\n      audio content in synchronized media, except when the media is a media alternative for text and is clearly labeled as such.\n   "
	},
	"1.2.3": {
		"name": "Audio Description or Media Alternative (Prerecorded)",
		"number": "1.2.3",
		"conformanceLevel": "A",
		"description": "An alternative for time-based media or audio description of the prerecorded\n      video content is provided for synchronized media, except when the media is a media alternative for text and is clearly labeled as such.\n   "
	},
	"1.2.4": {
		"name": "Captions (Live)",
		"number": "1.2.4",
		"conformanceLevel": "AA",
		"description": "Captions are provided for all live\n      audio content in synchronized media.\n   "
	},
	"1.2.5": {
		"name": "Audio Description (Prerecorded)",
		"number": "1.2.5",
		"conformanceLevel": "AA",
		"description": "Audio description is provided for all prerecorded\n      video content in synchronized media.\n   "
	},
	"1.2.6": {
		"name": "Sign Language (Prerecorded)",
		"number": "1.2.6",
		"conformanceLevel": "AAA",
		"description": "Sign language interpretation is provided for all prerecorded\n      audio content in synchronized media.\n   "
	},
	"1.2.7": {
		"name": "Extended Audio Description (Prerecorded)",
		"number": "1.2.7",
		"conformanceLevel": "AAA",
		"description": "Where pauses in foreground audio are insufficient to allow audio descriptions to convey the sense of the video, extended audio description is provided for all prerecorded\n      video content in synchronized media.\n   "
	},
	"1.2.8": {
		"name": "Media Alternative (Prerecorded)",
		"number": "1.2.8",
		"conformanceLevel": "AAA",
		"description": "An alternative for time-based media is provided for all prerecorded\n      synchronized media and for all prerecorded video-only media.\n   "
	},
	"1.2.9": {
		"name": "Audio-only (Live)",
		"number": "1.2.9",
		"conformanceLevel": "AAA",
		"description": "An alternative for time-based media that presents equivalent information for live\n      audio-only content is provided.\n   "
	},
	"1.3.1": {
		"name": "Info and Relationships",
		"number": "1.3.1",
		"conformanceLevel": "A",
		"description": "Information, structure, and relationships conveyed through presentation can be programmatically determined or are available in text.\n   "
	},
	"1.3.2": {
		"name": "Meaningful Sequence",
		"number": "1.3.2",
		"conformanceLevel": "A",
		"description": "When the sequence in which content is presented affects its meaning, a correct reading sequence can be programmatically determined.\n   "
	},
	"1.3.3": {
		"name": "Sensory Characteristics",
		"number": "1.3.3",
		"conformanceLevel": "A",
		"description": "Instructions provided for understanding and operating content do not rely solely on\n      sensory characteristics of components such as shape, color, size, visual location, orientation,\n      or sound.\n   "
	},
	"1.3.4": {
		"name": "Orientation",
		"number": "1.3.4",
		"conformanceLevel": "AA",
		"description": "Content does not restrict its view and operation to a single display orientation, such as portrait or landscape, unless a specific display orientation is essential."
	},
	"1.3.5": {
		"name": "Identify Input Purpose",
		"number": "1.3.5",
		"conformanceLevel": "AA",
		"description": "The purpose of each input field collecting information about the user can be programmatically determined when:"
	},
	"1.3.6": {
		"name": "Identify Purpose",
		"number": "1.3.6",
		"conformanceLevel": "AAA",
		"description": "In content implemented using markup languages, the purpose of user interface components, icons, and regions can be programmatically determined."
	},
	"1.4.1": {
		"name": "Use of Color",
		"number": "1.4.1",
		"conformanceLevel": "A",
		"description": "Color is not used as the only visual means of conveying information, indicating an\n      action, prompting a response, or distinguishing a visual element.\n   "
	},
	"1.4.2": {
		"name": "Audio Control",
		"number": "1.4.2",
		"conformanceLevel": "A",
		"description": "If any audio on a Web page plays automatically for more than 3 seconds, either a mechanism is available to pause or stop the audio, or a mechanism is available to control audio\n      volume independently from the overall system volume level.\n   "
	},
	"1.4.3": {
		"name": "Contrast (Minimum)",
		"number": "1.4.3",
		"conformanceLevel": "AA",
		"description": "The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for the following:\n   \n\n      \n      Large Text\n      \n      \n         \n         Large-scale text and images of large-scale text have a contrast ratio of at least 3:1;\n         \n         \n      \n      \n      Incidental\n      \n      \n         \n         Text or images of text that are part of an inactive user interface component, that are pure decoration, that are not visible to anyone, or that are part of a picture that contains significant\n            other visual content, have no contrast requirement.\n         \n         \n      \n      \n      Logotypes\n      \n      \n         \n         Text that is part of a logo or brand name has no contrast requirement.\n         \n      \n      \n   \nLarge Text\nIncidental\nLogotypes"
	},
	"1.4.4": {
		"name": "Resize Text",
		"number": "1.4.4",
		"conformanceLevel": "AA",
		"description": "Except for captions and images of text, text can be resized without assistive technology up to 200 percent without loss of content or functionality.\n   "
	},
	"1.4.5": {
		"name": "Images of Text",
		"number": "1.4.5",
		"conformanceLevel": "AA",
		"description": "If the technologies being used can achieve the visual presentation, text is used to convey information rather than images of text except for the following:\n   \n\n      \n      Customizable\n      \n      \n         \n         The image of text can be visually customized to the user's requirements;\n         \n         \n      \n      \n      Essential\n      \n      \n         \n         A particular presentation of text is essential to the information being conveyed.\n         \n         \n      \n      \n   \nCustomizable\nEssential"
	},
	"1.4.6": {
		"name": "Contrast (Enhanced)",
		"number": "1.4.6",
		"conformanceLevel": "AAA",
		"description": "The visual presentation of text and images of text has a contrast ratio of at least 7:1, except for the following:\n   \n\n      \n      Large Text\n      \n      \n         \n         Large-scale text and images of large-scale text have a contrast ratio of at least 4.5:1;\n         \n         \n      \n      \n      Incidental\n      \n      \n         \n         Text or images of text that are part of an inactive user interface component, that are pure decoration, that are not visible to anyone, or that are part of a picture that contains significant\n            other visual content, have no contrast requirement.\n         \n         \n      \n      \n      Logotypes\n      \n      \n         \n         Text that is part of a logo or brand name has no contrast requirement.\n         \n      \n      \n   \nLarge Text\nIncidental\nLogotypes"
	},
	"1.4.7": {
		"name": "Low or No Background Audio",
		"number": "1.4.7",
		"conformanceLevel": "AAA",
		"description": "For prerecorded\n      audio-only content that (1) contains primarily speech in the foreground, (2) is not an audio\n      CAPTCHA or audio logo, and (3) is not vocalization intended to be primarily musical expression\n      such as singing or rapping, at least one of the following is true:\n   \n\n      \n      No Background\n      \n      \n         \n         The audio does not contain background sounds.\n         \n      \n      \n      Turn Off\n      \n      \n         \n         The background sounds can be turned off.\n         \n      \n      \n      20 dB\n      \n      \n         \n         The background sounds are at least 20 decibels lower than the foreground speech content,\n            with the exception of occasional sounds that last for only one or two seconds.\n         \n         \n         NotePer the definition of \"decibel,\" background sound that meets this requirement will\n            be approximately four times quieter than the foreground speech content.\n         \n         \n      \n      \n   \nNo Background\nTurn Off\n20 dB"
	},
	"1.4.8": {
		"name": "Visual Presentation",
		"number": "1.4.8",
		"conformanceLevel": "AAA",
		"description": "For the visual presentation of blocks of text, a mechanism is available to achieve the following:\n   "
	},
	"1.4.9": {
		"name": "Images of Text (No Exception)",
		"number": "1.4.9",
		"conformanceLevel": "AAA",
		"description": "Images of text are only used for pure decoration or where a particular presentation of text is essential to the information being conveyed.\n   "
	},
	"1.4.10": {
		"name": "Reflow",
		"number": "1.4.10",
		"conformanceLevel": "AA",
		"description": "Content can be presented without loss of information or functionality, and without requiring scrolling in two dimensions for:"
	},
	"1.4.11": {
		"name": "Non-text Contrast",
		"number": "1.4.11",
		"conformanceLevel": "AA",
		"description": "The visual presentation of the following have a contrast ratio of at least 3:1 against adjacent color(s):\n\n      \t\t\t\t\t\t\n      User Interface Components\n      \t\t\t\t\t\t\n     Visual information required to identify user interface components and states, except for inactive components or where the appearance of the component is determined by the user agent and not modified by the author;\n      \t\t\t\t\t\t\n      Graphical Objects\n      \t\t\t\t\t\t\n      Parts of graphics required to understand the content, except when a particular presentation of graphics is essential to the information being conveyed.\n      \t\t\t\t\t\t\n   \nUser Interface Components\nGraphical Objects"
	},
	"1.4.12": {
		"name": "Text Spacing",
		"number": "1.4.12",
		"conformanceLevel": "AA",
		"description": "In content implemented using markup languages that support the following text style properties, no loss of content or functionality occurs by setting all of the following and by changing no other style property:"
	},
	"1.4.13": {
		"name": "Content on Hover or Focus",
		"number": "1.4.13",
		"conformanceLevel": "AA",
		"description": "Where receiving and then removing pointer hover or keyboard focus triggers additional content to become visible and then hidden, the following are true:\n\n\n    Dismissible\n    A mechanism is available to dismiss the additional content without moving pointer hover or keyboard focus, unless the additional content communicates an input error or does not obscure or replace other content;\n\n    Hoverable\n   If pointer hover can trigger the additional content, then the pointer can be moved  over the additional content without the additional content disappearing;\n\n    Persistent\n    The additional content remains visible until the hover or focus trigger is removed, the user dismisses it, or its information is no longer valid.\n\n  \nDismissible\nHoverable\nPersistent"
	},
	"2.1.1": {
		"name": "Keyboard",
		"number": "2.1.1",
		"conformanceLevel": "A",
		"description": "All functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes, except where the underlying\n      function requires input that depends on the path of the user's movement and not just\n      the endpoints.\n   "
	},
	"2.1.2": {
		"name": "No Keyboard Trap",
		"number": "2.1.2",
		"conformanceLevel": "A",
		"description": "If keyboard focus can be moved to a component of the page using a keyboard interface, then focus can be moved away from that component using only a keyboard interface,\n      and, if it requires more than unmodified arrow or tab keys or other standard exit\n      methods, the user is advised of the method for moving focus away.\n   "
	},
	"2.1.3": {
		"name": "Keyboard (No Exception)",
		"number": "2.1.3",
		"conformanceLevel": "AAA",
		"description": "All functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes.\n   "
	},
	"2.1.4": {
		"name": "Character Key Shortcuts",
		"number": "2.1.4",
		"conformanceLevel": "A",
		"description": "If a keyboard shortcut is implemented in content using only letter (including upper- and lower-case letters), punctuation, number, or symbol characters, then at least one of the following is true:\n\n   \n   Turn off\n    A mechanism is available to turn the shortcut off;\n      \t\t\t\t\t\t\n   Remap\n     A mechanism is available to remap the shortcut to include one or more non-printable keyboard keys (e.g., Ctrl, Alt);\n\n    Active only on focus\n    The keyboard shortcut for a user interface component is only active when that component has focus.\n    \n  \nTurn off\nRemap\nActive only on focus"
	},
	"2.2.1": {
		"name": "Timing Adjustable",
		"number": "2.2.1",
		"conformanceLevel": "A",
		"description": "For each time limit that is set by the content, at least one of the following is true:\n\n      \n      Turn off\n      \n      \n         \n         The user is allowed to turn off the time limit before encountering it; or\n         \n      \n      \n      Adjust\n      \n      \n         \n         The user is allowed to adjust the time limit before encountering it over a wide range\n            that is at least ten times the length of the default setting; or\n         \n         \n      \n      \n      Extend\n      \n      \n         \n         The user is warned before time expires and given at least 20 seconds to extend the\n            time limit with a simple action (for example, \"press the space bar\"), and the user\n            is allowed to extend the time limit at least ten times; or\n         \n         \n      \n      \n      Real-time Exception\n      \n      \n         \n         The time limit is a required part of a real-time event (for example, an auction),\n            and no alternative to the time limit is possible; or\n         \n         \n      \n      \n      Essential Exception\n      \n      \n         \n         The time limit is essential and extending it would invalidate the activity; or\n         \n         \n      \n      \n      20 Hour Exception\n      \n      \n         \n         The time limit is longer than 20 hours.\n         \n      \n      \n   \nTurn off\nAdjust\nExtend\nReal-time Exception\nEssential Exception\n20 Hour Exception"
	},
	"2.2.2": {
		"name": "Pause, Stop, Hide",
		"number": "2.2.2",
		"conformanceLevel": "A",
		"description": "For moving, blinking, scrolling, or auto-updating information, all of the following are true:\n   \n\n      \n      Moving, blinking, scrolling\n      \n      \n         \n         For any moving, blinking or scrolling information that (1) starts automatically, (2)\n            lasts more than five seconds, and (3) is presented in parallel with other content,\n            there is a mechanism for the user to pause, stop, or hide it unless the movement, blinking, or scrolling is part of an activity\n            where it is essential; and\n         \n         \n      \n      \n      Auto-updating\n      \n      \n         \n         For any auto-updating information that (1) starts automatically and (2) is presented\n            in parallel with other content, there is a mechanism for the user to pause, stop,\n            or hide it or to control the frequency of the update unless the auto-updating is part\n            of an activity where it is essential.\n         \n         \n      \n      \n   \nMoving, blinking, scrolling\nAuto-updating"
	},
	"2.2.3": {
		"name": "No Timing",
		"number": "2.2.3",
		"conformanceLevel": "AAA",
		"description": "Timing is not an essential part of the event or activity presented by the content, except for non-interactive\n      synchronized media and real-time events.\n   "
	},
	"2.2.4": {
		"name": "Interruptions",
		"number": "2.2.4",
		"conformanceLevel": "AAA",
		"description": "Interruptions can be postponed or suppressed by the user, except interruptions involving\n      an emergency.\n   "
	},
	"2.2.5": {
		"name": "Re-authenticating",
		"number": "2.2.5",
		"conformanceLevel": "AAA",
		"description": "When an authenticated session expires, the user can continue the activity without\n      loss of data after re-authenticating.\n   "
	},
	"2.2.6": {
		"name": "Timeouts",
		"number": "2.2.6",
		"conformanceLevel": "AAA",
		"description": "Users are warned of the duration of any user inactivity that could cause data loss, unless the data is preserved for more than 20 hours when the user does not take any actions."
	},
	"2.3.1": {
		"name": "Three Flashes or Below Threshold",
		"number": "2.3.1",
		"conformanceLevel": "A",
		"description": "Web pages do not contain anything that flashes more than three times in any one second period,\n      or the flash is below the general flash and red flash thresholds.\n   "
	},
	"2.3.2": {
		"name": "Three Flashes",
		"number": "2.3.2",
		"conformanceLevel": "AAA",
		"description": "Web pages do not contain anything that flashes more than three times in any one second period.\n   "
	},
	"2.3.3": {
		"name": "Animation from Interactions",
		"number": "2.3.3",
		"conformanceLevel": "AAA",
		"description": "Motion animation triggered by interaction can be disabled, unless the animation is essential to the functionality or the information being conveyed."
	},
	"2.4.1": {
		"name": "Bypass Blocks",
		"number": "2.4.1",
		"conformanceLevel": "A",
		"description": "A mechanism is available to bypass blocks of content that are repeated on multiple Web pages.\n   "
	},
	"2.4.2": {
		"name": "Page Titled",
		"number": "2.4.2",
		"conformanceLevel": "A",
		"description": "Web pages have titles that describe topic or purpose.\n   "
	},
	"2.4.3": {
		"name": "Focus Order",
		"number": "2.4.3",
		"conformanceLevel": "A",
		"description": "If a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive\n      focus in an order that preserves meaning and operability.\n   "
	},
	"2.4.4": {
		"name": "Link Purpose (In Context)",
		"number": "2.4.4",
		"conformanceLevel": "A",
		"description": "The purpose of each link can be determined from the link text alone or from the link text together with its\n      programmatically determined link context, except where the purpose of the link would be ambiguous to users in general.\n   "
	},
	"2.4.5": {
		"name": "Multiple Ways",
		"number": "2.4.5",
		"conformanceLevel": "AA",
		"description": "More than one way is available to locate a Web page within a set of Web pages except where the Web Page is the result of, or a step in, a process.\n   "
	},
	"2.4.6": {
		"name": "Headings and Labels",
		"number": "2.4.6",
		"conformanceLevel": "AA",
		"description": "Headings and labels describe topic or purpose.\n   "
	},
	"2.4.7": {
		"name": "Focus Visible",
		"number": "2.4.7",
		"conformanceLevel": "AA",
		"description": "Any keyboard operable user interface has a mode of operation where the keyboard focus\n      indicator is visible.\n   "
	},
	"2.4.8": {
		"name": "Location",
		"number": "2.4.8",
		"conformanceLevel": "AAA",
		"description": "Information about the user's location within a set of Web pages is available.\n   "
	},
	"2.4.9": {
		"name": "Link Purpose (Link Only)",
		"number": "2.4.9",
		"conformanceLevel": "AAA",
		"description": "A mechanism is available to allow the purpose of each link to be identified from link text alone,\n      except where the purpose of the link would be ambiguous to users in general.\n   "
	},
	"2.4.10": {
		"name": "Section Headings",
		"number": "2.4.10",
		"conformanceLevel": "AAA",
		"description": "Section headings are used to organize the content.\n   "
	},
	"2.4.11": {
		"name": "Focus Not Obscured (Minimum)",
		"number": "2.4.11",
		"conformanceLevel": "AA",
		"description": "When a user interface component receives keyboard focus, the component is not entirely hidden due to author-created content."
	},
	"2.4.12": {
		"name": "Focus Not Obscured (Enhanced)",
		"number": "2.4.12",
		"conformanceLevel": "AAA",
		"description": "When a user interface component receives keyboard focus, no part of the component is hidden by author-created content."
	},
	"2.4.13": {
		"name": "Focus Appearance",
		"number": "2.4.13",
		"conformanceLevel": "AAA",
		"description": "When the keyboard focus indicator is visible, an area of the focus indicator meets all the following:"
	},
	"2.5.1": {
		"name": "Pointer Gestures",
		"number": "2.5.1",
		"conformanceLevel": "A",
		"description": "All functionality that uses multipoint or path-based gestures for operation can be operated with a single pointer without a path-based gesture, unless a multipoint or path-based gesture is essential."
	},
	"2.5.2": {
		"name": "Pointer Cancellation",
		"number": "2.5.2",
		"conformanceLevel": "A",
		"description": "For functionality that can be operated using a single pointer, at least one of the following is true:\n\n   \n   No Down-Event\n     The down-event of the pointer is not used to execute any part of the function;\n      \t\t\t\t\t\t\n   Abort or Undo\n     Completion of the function is on the up-event, and a mechanism is available to abort the function before completion or to undo the function after completion;\n      \t\t\t\t\t\t\n   Up Reversal\n     The up-event reverses any outcome of the preceding down-event;\n      \t\t\t\t\t\t\n   Essential\n     Completing the function on the down-event is essential.\n      \t\t\t\t\t\t\n   \nNo Down-Event\nAbort or Undo\nUp Reversal\nEssential"
	},
	"2.5.3": {
		"name": "Label in Name",
		"number": "2.5.3",
		"conformanceLevel": "A",
		"description": "For user interface components with labels that include text or images of text, the name contains the text that is presented visually."
	},
	"2.5.4": {
		"name": "Motion Actuation",
		"number": "2.5.4",
		"conformanceLevel": "A",
		"description": "Functionality that can be operated by device motion or user motion can also be operated by user interface components and responding to the motion can be disabled to prevent accidental actuation, except when:\n\n   \n   Supported Interface\n     The motion is used to operate functionality through an accessibility supported interface;\n   \n   Essential\n   The motion is essential for the function and doing so would invalidate the activity.\n   \n   \nSupported Interface\nEssential"
	},
	"2.5.5": {
		"name": "Target Size (Enhanced)",
		"number": "2.5.5",
		"conformanceLevel": "AAA",
		"description": "The size of the target for pointer inputs is at least 44 by 44 CSS pixels except when:\n\n\tEquivalent \n  The target is available through an equivalent link or control on the same page that is at least 44 by 44 CSS pixels;\n\tInline \n  The target is in a sentence or block of text;\n\tUser Agent Control \n  The size of the target is determined by the user agent and is not modified by the author;\n\tEssential \n  A particular presentation of the target is essential to the information being conveyed.\n\nEquivalent\nInline\nUser Agent Control\nEssential"
	},
	"2.5.6": {
		"name": "Concurrent Input Mechanisms",
		"number": "2.5.6",
		"conformanceLevel": "AAA",
		"description": "Web content does not restrict use of input modalities available on a platform except where the restriction is essential, required to ensure the security of the content, or required to respect user settings."
	},
	"2.5.7": {
		"name": "Dragging Movements",
		"number": "2.5.7",
		"conformanceLevel": "AA",
		"description": "All functionality that uses a dragging movement for operation can be achieved by a single pointer without dragging, unless dragging is essential or the functionality is determined by the user agent and not modified by the author."
	},
	"2.5.8": {
		"name": "Target Size (Minimum)",
		"number": "2.5.8",
		"conformanceLevel": "AA",
		"description": "The size of the target for pointer inputs is at least 24 by 24 CSS pixels, except where:"
	},
	"3.1.1": {
		"name": "Language of Page",
		"number": "3.1.1",
		"conformanceLevel": "A",
		"description": "The default human language of each Web page can be programmatically determined.\n   "
	},
	"3.1.2": {
		"name": "Language of Parts",
		"number": "3.1.2",
		"conformanceLevel": "AA",
		"description": "The human language of each passage or phrase in the content can be programmatically determined except for proper names, technical terms, words of indeterminate language, and words\n      or phrases that have become part of the vernacular of the immediately surrounding\n      text.\n   "
	},
	"3.1.3": {
		"name": "Unusual Words",
		"number": "3.1.3",
		"conformanceLevel": "AAA",
		"description": "A mechanism is available for identifying specific definitions of words or phrases used in an unusual or restricted way, including idioms and jargon.\n   "
	},
	"3.1.4": {
		"name": "Abbreviations",
		"number": "3.1.4",
		"conformanceLevel": "AAA",
		"description": "A mechanism for identifying the expanded form or meaning of abbreviations is available.\n   "
	},
	"3.1.5": {
		"name": "Reading Level",
		"number": "3.1.5",
		"conformanceLevel": "AAA",
		"description": "When text requires reading ability more advanced than the lower secondary education level after removal of proper names and titles, supplemental content, or a version that does not require reading ability more advanced than the lower\n      secondary education level, is available.\n   "
	},
	"3.1.6": {
		"name": "Pronunciation",
		"number": "3.1.6",
		"conformanceLevel": "AAA",
		"description": "A mechanism is available for identifying specific pronunciation of words where meaning of the\n      words, in context, is ambiguous without knowing the pronunciation.\n   "
	},
	"3.2.1": {
		"name": "On Focus",
		"number": "3.2.1",
		"conformanceLevel": "A",
		"description": "When any user interface component receives focus, it does not initiate a change of context.\n   "
	},
	"3.2.2": {
		"name": "On Input",
		"number": "3.2.2",
		"conformanceLevel": "A",
		"description": "Changing the setting of any user interface component does not automatically cause a change of context unless the user has been advised of the behavior before using the component.\n   "
	},
	"3.2.3": {
		"name": "Consistent Navigation",
		"number": "3.2.3",
		"conformanceLevel": "AA",
		"description": "Navigational mechanisms that are repeated on multiple Web pages within a set of Web pages occur in the same relative order each time they are repeated, unless a change is initiated by the user.\n   "
	},
	"3.2.4": {
		"name": "Consistent Identification",
		"number": "3.2.4",
		"conformanceLevel": "AA",
		"description": "Components that have the same functionality within a set of Web pages are identified consistently.\n   "
	},
	"3.2.5": {
		"name": "Change on Request",
		"number": "3.2.5",
		"conformanceLevel": "AAA",
		"description": "Changes of context are initiated only by user request or a mechanism is available to turn off such changes.\n   "
	},
	"3.2.6": {
		"name": "Consistent Help",
		"number": "3.2.6",
		"conformanceLevel": "A",
		"description": "If a Web page contains any of the following help mechanisms, and those mechanisms are repeated on multiple Web pages within a set of Web pages, they occur in the same order relative to other page content, unless a change is initiated by the user:"
	},
	"3.3.1": {
		"name": "Error Identification",
		"number": "3.3.1",
		"conformanceLevel": "A",
		"description": "If an input error is automatically detected, the item that is in error is identified and the error\n      is described to the user in text.\n   "
	},
	"3.3.2": {
		"name": "Labels or Instructions",
		"number": "3.3.2",
		"conformanceLevel": "A",
		"description": "Labels or instructions are provided when content requires user input.\n   "
	},
	"3.3.3": {
		"name": "Error Suggestion",
		"number": "3.3.3",
		"conformanceLevel": "AA",
		"description": "If an input error is automatically detected and suggestions for correction are known, then the suggestions\n      are provided to the user, unless it would jeopardize the security or purpose of the\n      content.\n   "
	},
	"3.3.4": {
		"name": "Error Prevention (Legal, Financial, Data)",
		"number": "3.3.4",
		"conformanceLevel": "AA",
		"description": "For Web pages that cause legal commitments or financial transactions for the user to occur, that modify or delete user-controllable data in data storage systems, or that submit user test responses, at least one of\n      the following is true:\n   \n\n     ReversibleSubmissions are reversible.\n     CheckedData entered by the user is checked for input errors and the user is provided an opportunity to correct them.\n     ConfirmedA mechanism is available for reviewing, confirming, and correcting information before finalizing the submission.\n  \nReversible\nChecked\nConfirmed"
	},
	"3.3.5": {
		"name": "Help",
		"number": "3.3.5",
		"conformanceLevel": "AAA",
		"description": "Context-sensitive help is available.\n   "
	},
	"3.3.6": {
		"name": "Error Prevention (All)",
		"number": "3.3.6",
		"conformanceLevel": "AAA",
		"description": "For Web pages that require the user to submit information, at least one of the following is true:\n   \n\n     ReversibleSubmissions are reversible.\n     CheckedData entered by the user is checked for input errors and the user is provided an opportunity to correct them.\n     ConfirmedA mechanism is available for reviewing, confirming, and correcting information before finalizing the submission.\n  \nReversible\nChecked\nConfirmed"
	},
	"3.3.7": {
		"name": "Redundant Entry",
		"number": "3.3.7",
		"conformanceLevel": "A",
		"description": "Information previously entered by or provided to the user that is required to be entered again in the same process is either:"
	},
	"3.3.8": {
		"name": "Accessible Authentication (Minimum)",
		"number": "3.3.8",
		"conformanceLevel": "AA",
		"description": "A cognitive function test (such as remembering a password or solving a puzzle) is not required for any step in an authentication process unless that step provides at least one of the following:\n\n        Alternative\n        Another authentication method that does not rely on a cognitive function test.\n        Mechanism\n      A mechanism is available to assist the user in completing the cognitive function test.\n        Object Recognition\n        The cognitive function test is to recognize objects.\n        Personal Content\n      The cognitive function test is to identify non-text content the user provided to the Web site.\n    \nAlternative\nMechanism\nObject Recognition\nPersonal Content"
	},
	"3.3.9": {
		"name": "Accessible Authentication (Enhanced)",
		"number": "3.3.9",
		"conformanceLevel": "AAA",
		"description": "A cognitive function test (such as remembering a password or solving a puzzle) is not required for any step in an authentication process unless that step provides at least one of the following:\n\n        Alternative\n        Another authentication method that does not rely on a cognitive function test.\n        Mechanism\n        A mechanism is available to assist the user in completing the cognitive function test.\n    \nAlternative\nMechanism"
	},
	"4.1.1": {
		"name": "Parsing (Obsolete and removed)",
		"number": "4.1.1",
		"conformanceLevel": "A"
	},
	"4.1.2": {
		"name": "Name, Role, Value",
		"number": "4.1.2",
		"conformanceLevel": "A",
		"description": "For all user interface components (including but not limited to: form elements, links and components generated by scripts),\n      the name and role can be programmatically determined; states, properties, and values that can be set by the user can be programmatically set; and notification of changes to these items is available to user agents, including assistive technologies.\n   "
	},
	"4.1.3": {
		"name": "Status Messages",
		"number": "4.1.3",
		"conformanceLevel": "AA",
		"description": "In content implemented using markup languages, status messages can be programmatically determined through role or properties such that they can be presented to the user by assistive technologies without receiving focus."
	}
}

/*
(() => {
    let scDescs = {};
    let textarea = document.createElement('textarea');
    document.body.prepend(textarea);

    let toc = document.getElementById('toc');
    let principles = [...toc.querySelector('ol').children].filter((c, i) => i >= 3 && i <= 6);
    for (let principle of principles) {
        let scLinks = principle.querySelectorAll(':scope > ol > li > ol > li > a:not(#parsing)');
        for (let link of [...scLinks]) {
            let section = document.getElementById(link.href.split('#')[1]);
            try {
                let scDesc = {
                    name: link.childNodes.item(1).wholeText.trim(),
                    number: link.querySelector('bdi').textContent.trim(),
                    conformanceLevel: getLevel(section),
                    description: getDescription(section)
                }
                if (!scDesc.conformanceLevel) continue;
                scDescs[scDesc.number] = scDesc;
            } catch (e) {
                debugger;
            }
        }
    }

    textarea.value = JSON.stringify(scDescs, null, '\t');

    function getLevel(section) {
        let text = section.querySelector('.conformance-level');
        if (!text) return 'A';
        text = text.textContent;
        if (text.includes('Level AAA')) return 'AAA';
        else if (text.includes('Level AA')) return 'AA';
        else return 'A';
    }

    function getDescription(section) {
        let description = "";
        let mainDesc = section.querySelector('p:not([class])');
        description = mainDesc?.textContent;
        for (let pair of [...section.querySelectorAll(':is(dt,dl)')]) {
            description += '\n' + pair.textContent;
        }
        return description
    }
})()*/