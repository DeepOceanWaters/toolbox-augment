export const tokens = {
    aliases: {
        bp: "bestpractice",
        re: "recommendation",
        req: "requirement",
        res: "resources",
        lin: "labelinname",
        i: 'issues',
        u: 'usability',
        deco: 'decorative',
        comp: 'component',
        hi: 'hierarchy',
        msg: 'message'
    },

    keywords: (
        (new Set())
            .add('value')
            .add('defaultVar')
            .add('all')
    ),

    cctext: {
        requirement: "Ensure that normal text has at least a 4.5:1 color contrast against its background color, and that large-scale text has at least a 3:1 color contrast ratio against its background color."
    },

    ccgraphic: {
        requirement: "Ensure that the contrast ratio meets the ratio 3:1 for interactable components or parts of graphical objects required to understand the content."
    },

    state: {
        requirement: "Ensure that when users can set the state of an interactive component, that state can be set and determined programmatically.",
        issues: "The state ($var$) of this component is not programmatically determinable.",
        update: {
            issues: "The state ($var$) of this component is not properly updated."
        },
        null: {
            issues: "The state ($var$) of this component is not programmatically determinable.",
            requirement: "Ensure that when users can set the state of an interactive component, that state can be set and determined programmatically.",
            recommendation: "",
            defaultVar: ""
        }
    },

    textspacing: {
        recommendation: ""
            + "{"
            + " line-height: 1.5 !important;"
            + " letter-spacing: 0.12em !important;"
            + " word-spacing: 0.16em !important;"
            + "}"
            + ""
            + "p{"
            + " margin-bottom: 2em !important;"
            + "}",
        issues: "",
        requirement: "",
    },

    focus: {
        onfocus: {
            requirement: "Ensure that moving focus does not cause a change of context."
        },
        hidden: {
            relatedsc: ["2.4.3"],
            issues: "Visually hidden content receives focus.",
            requirement: "Ensure that visually hidden content is either removed from focus order, or becomes visible when in focus.",
            recommendation: "Content can be removed from focus order by adding TABINDEX=-1."
        },
        href: {
            issues: "This ANCHOR element is not focusable and does not have an appropriate role as it does not have an HREF attribute. Note that ANCHOR elements without an HREF attribute have a role of GENERIC and are not focusable.",
            requirement: "Ensure that interactive anchor elements have an HREF attribute, or are given an appropriate role and can be operated using a keyboard.",
            recommendation: "We recommend giving this ANCHOR element the HREF attribute. Otherwise we recommend giving it a ROLE of LINK, and TABINDEX=0."
        },
        manage: {
            open: {
                relatedsc: ["2.4.3"],
                issues: "When opening this dialog, focus is not managed and remains on the component that opened it.",
                requirement: "Ensure that when a modal dialog is opened, that focus is moved into the dialog.",
                recommendation: "We recommend placing focus on the first focusable element in the dialog."
            },
            remove: {
                issues: "When this content is removed, focus is not managed.",
                requirement: "Ensure that when content in focus is removed, focus is managed and placed somewhere logical.",
                recommendation: ""
            },
            restrict: {
                disclosure: {
                    issues: "Focus is not restricted within this content, and this disclosure does not collapse when focus moves out of it.",
                    requirement: "Ensure that when disclosure widgets can obscure other content, that focus is either restricted within the disclosure widget, or the disclosure widget is collapsed when focus moves out of it.",
                    recommendation: ""
                },
                dialog: {
                    issues: "Focus is not restricted within this modal dialog.",
                    requirement: "Ensure that modal dialogs restrict focus within themselves.",
                    recommendation: "Typically, modal content restricts focus using JavaScript, where: \n- when moving focus forward while on the last element in the modal content, focus moves to the first focusable element in the modal content\n- when moving focus backwards while on the first element in the modal content, focus moves to the last focusable element in the modal content."
                }
            }
        },
        visible: {
            issues: "This component does not have a visible focus indicator.",
            requirement: "Ensure that content in focus has a visible focus indicator, and the focus indicator has at least a 3:1 color contrast ratio against adjacent colors.",
            recommendation: "We recommend using a solid outline with a width of at least 2px, that also contrasts well with its adjacent colors (at least a 3:1 color contrast ratio).",
            lose: {
                recommendation: "Ensure that activating a component does not cause the component to lose its focus indicator."
            }
        },
        nested: {
            relatedsc: ["2.4.3"],
            issues: "This component takes two tab stops as it is wrapped in an element with TABINDEX=0.",
            requirement: "Ensure that each component only takes one tab stop.",
            recommendation: "We recommend removing the non-interactive element that wraps this component from focus order - this can be done by removing the TABINDEX attribute or setting TABINDEX=-1.",
            interactive: {
                relatedsc: ["2.4.3", "4.1.3"],
                issues: "This component is nested inside another interactive component, this causes two tab stops for the same component, and makes the role of the component ambiguous.",
                requirement: "Ensure that interactive components are not nested, and that each component only takes one tab stop.",
                recommendation: "We recommend removing one of the interactive elements."
            }
        },
        noninteractive: {
            issues: "This content is not interactive but is in focus order.",
            recommendation: "We recommend removing non-interactive content from focus order unless there is a good reason for it to be focusable.\n\nNon-interactive content can be removed from focus order by removing TABINDEX attribute."
        },
        emptyElement: {
            relatedsc: ["2.4.3", "2.4.7"],
            issues: "This element is empty but is in focus order. As a result, it does not have an accessible name and it does not have a visible focus indicator while in focus.",
            requirement: "Ensure that empty elements are either constructed properly, or removed.",
        }
    },

    oninput: {
        requirement: "Ensure that changing the setting of an interactive component does not cause an automatic change in context",
        recommendation: "We recommend either:\n- add a submit button and only update the content on submission\n- OR add text before these controls that notes that they will automatically update the associated content when their value is set",
    },

    name: {
        issues: "This component does not have an accessible name.",
        requirement: "Ensure that interactive components have an accessible name that describes their purpose.",
        recommendation: "We recommend either:\n- Adding a visually hidden SPAN element with text content that describes the purpose of this component\n- Using the ARIA-LABEL or ARIA-LABELLEDBY attribute",
        graphic: {
            issues: "This non-context content labels an interactive component, but it does not have a text alternative that describes the purpose/function of this component.",
            requirement: "Ensure that when non-text content labels an interactive component, it has a text alternative that describes the function/purpose of that component.",
            recommendation: "We recommend either:\n- updating the ALT attribute to describe the components purpose\n- Using the ARIA-LABEL or ARIA-LABELLEDBY attribute on the interactive component"
        },
        htmlLabelAllowed: {
            issues: "This component does not have an accessible name.",
            requirement: "Ensure that interactive components have an accessible name that describes their purpose.",
            recommendation: "We recommend adding a native HTML LABEL element and associating it with this component using the FOR attribute.\n\nAlternatively, an accessible name can be given by adding either the ARIA-LABEL or ARIA-LABELLEDBY attribute on the component.",
            improperAssociation: {
                issues: "This component does not have an accessible name. Currently the component has an associated LABEL element, but the association is broken.",
                requirement: "Ensure that interactive components have an accessible name that describes their purpose.",
                recommendation: "To ensure that LABEL elements are properly associated with a form field:\n- if the LABEL element is hidden, ensure that it is only visually hidden.\n- LABEL elements are associated with the first element found with the ID value in the FOR attribute.",
            }
        },
        badlabel: {
            issues: "This component does not have a label that describes its purpose/function.",
            requirement: "Ensure that interactive components have a label/accessible name that describes their purpose/function.",
            recommendation: ""
        },
        warning: {
            recommendation: "We recommend using either ARIA-LABELLEDBY or a visually hidden SPAN as opposed to ARIA-LABEL as automatic translation services typically do not update attributes such as ARIA-LABEL."
        }
    },

    role: {
        issues: "This component is interactive but does not have an appropriate role.",
        requirement: "Ensure that interactive components have an appropriate role.",
        dialog: {
            issues: "This content is a modal dialog, but it is not programmatically determinable as such.",
            requirement: "Ensure that modal dialogs are programmatically determinable as such.",
            recommendation: "We recommend adding the following attributes to an element that wraps this content:\n- ROLE=DIALOG\n- ARIA-MODAL=TRUE\n- ARIA-LABEL or ARIA-LABELLEDBY (to provide an accessible name that describes the dialog's purpose/content)"
        }
    },

    timing: {
        issues: "This content disappears after a time limit is hit, but there is now way to turn off, adjust, or extend this time limit.",
        requirement: "Ensure that there is a way to turn off, adjust, or extend time limits.",
        recommendation: "We recommend removing the time limit or allow users to extend the time limit (must be simple, such as pressing a button or key)."
    },

    label: {
        requirement: "Ensure that interactive components related to user input have a visible label at all times.",
        placeholder: {
            relatedsc: ["3.3.2"],
            issues: "This component is labeled by its placeholder text, but this text disappears when the form field has a non-empty value.",
            requirement: "Ensure that form fields' label is always visible while the form field is visible.",
            recommendation: "We recommend adding a LABEL element, and associating it with the component using its FOR attribute."
        }
    },

    mouseonly: {
        relatedsc: ["2.1.1", "4.1.2"],
        issues: "This content is not keyboard operable, and does not have an appropriate role or accessible name.",
        requirement: "Ensure that all functionality is operable using a keyboard, and that interactive components have an appropriate role and accessible name that describes its purpose.",
        andState: {
            issues: "This content is not keyboard operable, and does not have an appropriate role, accessible name, and its state is not programmatically determinable.",
            requirement: "Ensure that all functionality is operable using a keyboard, and that interactive components have an appropriate role, an accessible name that describes its purpose, and its state can be programmatically determined.",
        }
    },

    usecolor: {
        requirement: "Ensure that color is not the only means of distinguishing a visual element. Note that when the color contrast ratio is 3:1 or higher, then color is not considered the only means of distinguishing a visual element as luminance is perceived differently than hue/color."
    },

    reflow: {
        requirement: "Ensure that there is no loss of content or functionality when the viewport is set as described in the 1.4.10 Reflow Success Criterion (320 CSS Pixels width by 256 CSS Pixels height)."
    },

    resize: {
        requirement: "Ensure that there is no loss of content or functionality when zoomed in up to 200%."
    },

    keyboard: {
        requirement: "Ensure that all functionality of content can be operated using a keyboard.",
        unfocusable: {
            issues: "This content is not keyboard operable as it is not focusable.",
            requirement: "Ensure that all functionality of content can be operated using a keyboard.",
            recommendation: "We recommend adding TABINDEX=0 to this component."
        }
    },

    bestpractice: {
        requirement: "Note that this is a best practice, and not necessary for conformance.",
        futureIssue: {
            requirement: "Note that this is a best practice, and not necessary for conformance. However, we strongly recommend remediating this best practice issue as it has a heightened chance of becoming a full WCAG failure."
        }
    },

    usability: {
        requirement: "Note that this is a usability problem, and not necessary for conformance."
    },

    extra: {
        requirement: "In addition, while the following is not necessary for conformance, we recommend "
    },

    info: {
        relatedsc: ["1.3.1"],
        role: {
            issues: "This text presents as and acts as a $var$, but is not programmatically determinable as such.",
            recommendation: "We recommend converting this text into a $var$.",
            requirement: "Ensure that structure/relationships conveyed by presentation can be programmatically determined."
        },
        structure: {
            requirement: "Ensure that structure conveyed through presentation can be programmatically determined or is available in text."
        },
        info: {
            requirement: "Ensure that information conveyed through presentation can be programmatically determined or is available in text."
        },
        relationship: {
            requirement: "Ensure that relationships conveyed through presentation can be programmatically determined or is available in text."
        },
        hidden: {
            issues: "Visually hidden content is still available to AT.",
            requirement: "Ensure that when content is meant to be hidden from all users, it is also hidden from AT.",
            recommendation: "Content can be hidden from AT by adding ARIA-HIDDEN=TRUE. ARIA-HIDDEN=TRUE will hide the element and all its descendants from AT."
        },
        requirement: "Ensure that structure, relationships, and information conveyed through presentation can be programmatically determined or is available in text."
    },

    consistent: {
        id: {
            issues: "These components go to the same place $var$ but they are identified inconsistently.",
            recommendation: ""
        }
    },

    labelinname: {
        requirement: "Ensure that when text visually labels an interactive component, that component's accessible name includes that text word-for-word.",

        issues: "The text that visually labels this component is not present in its accessible name word-for-word."

    },

    focusvisible: {
        requirement: "Ensure that content in focus has a visible focus indicator, and the focus indicator has at least a 3:1 color contrast ratio against adjacent colors.",
        lose: {
            requirement: "Ensure that activating a component does not cause the component to lose its focus indicator."
        }
    },

    image: {
        noalt: {
            issues: "This non-text content does not have a text alternative.",
            requirement: "Ensure that non-text content has a text alternative that adequately describes the content in context.",
            recommendation: "We recommend giving this IMG element an ALT attribute."
        },
        badalt: {
            issues: "This non-text content has a text alternative, but it does not adequately describe the non-text content.",
            requirement: "Ensure that non-text content has a text alternative that adequately describes the content in context. If the non-text content is decorative, it should be implemented in a way such that AT can ignore it.",
            recommendation: ""
        },
        decorative: {
            issues: "This non-text content has a text alternative, but it is decorative.",
            requirement: "Ensure that decorative non-text content is implemented in a way such that AT can ignore it.",
            recommendation: "For IMG elements, we recommend setting the ALT attribute to be empty.\nFor SVG elements we recommend adding ARIA-HIDDEN=TRUE."
        }
    },

    link: {
        purpose: {
            issues: "The purpose of this link is ambiguous.",
            requirement: "Ensure that the purpose of each link is unambiguous.",
            recommendation: "We recommend adding the ARIA-DESCRIBEDBY attribute to provide context."
        },
    },


    focusindicator: {
        recommendation: "We recommend using a solid outline with a width of at least 2px, that also contrasts well with its adjacent colors (at least a 3:1 color contrast ratio)."
    },

    namere: {
        recommendation: "We recommend either:\n- Adding a visually hidden SPAN element with text content that describes the purpose of this component\n- Adding the attribute ARIA-LABEL with a value that describes the purpose of this component\n- Adding the attribute ARIA-LABELLEDBY with a value equal to the ID of an element that has text content that describes the purpose of this component"
    },

    heading: {
        requirement: "Ensure that text that presents as, and acts as a heading is programmatically determinable as such.",
        issues: "This text presents as and acts as a HEADING, but is not programmatically determinable as such.",
        recommendation: "We recommend converting this text into a HEADING element of the appropriate level.",
        empty: {
            issues: "This heading element empty.",
            requirement: "Ensure that headings describe the content that proceeds it.",
            recommendation: "We recommend removing this heading element if it is not being used. Otherwise please ensure that it has content that describes the content it heads."
        },
        null: {
            relatedsc: ["1.3.1"],
            issues: "This content is not visually presented as, and does not act as, a heading.",
            requirement: "Ensure that only text that acts and is presented as a heading is programmatically determinable as such.",
            recommendation: "We recommend replacing the HEADING element with a more appropriate element, such as a PARAGARAPH element. Alternatively, the attribute ROLE=NONE can be added to the HEADING element."
        },
        hierarchy: {
            relatedsc: ['1.3.1'],
            issues: "The visual/practical hierarchy of these headings does not match the programmatic hierarchy.",
            requirement: "Ensure that the visual/practical hierarchy of headings is programmatically determinable.",
            recommendation: "Heading levels (1-6) determine hierarchy. Heading levels can be skipped if necessary, but best practice is to ensure that heading levels aren't skipped - e.g. H2 is followed by an H3 if it is logical subsection of the H2 topic."
        }
    },

    scrollableregion: {
        recommendation: "We recommend wrapping this content in an element with the following properties:\n- ROLE=REGION\n- TABINDEX=0\n- ARIA-LABEL or ARIA-LABELLEDBY to provide an accessible name that describes the region"
    },

    labelre: {
        recommendation: "We recommend adding a native HTML LABEL element and programmatically associating it with the component using the LABEL's FOR attribute."
    },

    focusrestrict: {
        recommendation: "Typically, modal content restricts focus using JavaScript, where: \n- when moving focus forward while on the last element in the modal content, focus moves to the first focusable element in the modal content\n- when moving focus backwards while on the first element in the modal content, focus moves to the last focusable element in the modal content"
    },

    status: {
        requirement: "Ensure that status messages are implemented in a way such that AT can notify users of the message.",
        issues: "This status message is not implemented in a way such that AT is notifying users of the message.",
        recommendation: "We recommend adding a live region and updating this live region with the text of the status message.\n\nLive regions can be created by adding the ARIA-LIVE attribute with a value of either POLITE or ASSERTIVE to an element. The following ROLES have an implicit ARIA-LIVE attribute value:\n- ROLE=STATUS (implicit ARIA-LIVE value of POLITE)\n- ROLE=ALERT (implicit ARIA-LIVE value of ASSERTIVE)\n\nNote that users agents need time to register live regions before they can be used. As such, we recommend that all live regions are added to the DOM as soon as the page loads. If the live region is added dynamically, then a delay will need to be implemented before any change is made to that live region to ensure that it has been registered by all user agents and works as intended.",
        message: {
            relatedsc: ["4.1.3"],
            issues: "This status message is not implemented in a way such that AT is notifying users of the message.",
            requirement: "Ensure that status messages are implemented in a way such that AT can notify users of the message.",
            recommendation: "We recommend adding a live region and updating this live region with the text of the status message.\n\nLive regions can be created by adding the ARIA-LIVE attribute with a value of either POLITE or ASSERTIVE to an element. The following ROLES have an implicit ARIA-LIVE attribute value:\n- ROLE=STATUS (implicit ARIA-LIVE value of POLITE)\n- ROLE=ALERT (implicit ARIA-LIVE value of ASSERTIVE)\n\nNote that users agents need time to register live regions before they can be used. As such, we recommend that all live regions are added to the DOM as soon as the page loads. If the live region is added dynamically, then a delay will need to be implemented before any change is made to that live region to ensure that it has been registered by all user agents and works as intended."
        },
        loading: {
            relatedsc: ["4.1.3"],
            issues: "Loading animations act as status messages but this one is not implemented in a way such that AT is notifying users of the message.",
            requirement: "Ensure that status messages such as loading animations are implemented in a way such that AT can notify users of the message.",
            recommendation: "We recommend adding a live region and updating this live region with the text of the status message.\n\nLive regions can be created by adding the ARIA-LIVE attribute with a value of either POLITE or ASSERTIVE to an element. The following ROLES have an implicit ARIA-LIVE attribute value:\n- ROLE=STATUS (implicit ARIA-LIVE value of POLITE)\n- ROLE=ALERT (implicit ARIA-LIVE value of ASSERTIVE)\n\nNote that users agents need time to register live regions before they can be used. As such, we recommend that all live regions are added to the DOM as soon as the page loads. If the live region is added dynamically, then a delay will need to be implemented before any change is made to that live region to ensure that it has been registered by all user agents and works as intended."
        }
    },

    onhover: {
        dismiss: {
            issues: "This content appears on hover/focus, but can't be dismissed without moving the pointer/focus.",
            requirement: "Ensure that when content appears on hover/focus, that content can be dismissed without moving the pointer or focus.",
            recommendation: "We recommend either:\n- allow users to dismiss this content by pressing the Escape key\n- AND/OR allow users to dismiss this content by pressing the Control key"
        }
    },

    errors: {
        recommendation: "We recommend adding a list of errors at the top of the form where:\n- each list item identifies the form field in error with a link to the form field, and notes the error\n- focus is shifted onto the list of errors on form submission\nIf this is a long form, we recommend (in addition to the above) adding inline errors to each form field in error and associating that error with the form field as an accessible description.",
        resources: [
            "https://webaim.org/techniques/formvalidation/#form"
        ]
    },

    video: {
        audiodesc: {
            issues: "This video does not have an audio description.",
            requirement: "Ensure that videos have an audio description.",
            recommendation: "If the an audio description cannot be added to the video player, we recommend adding an audio description in text below the video. It can either be inside a disclosure widget (native HTML DETAILS/SUMMARY elements), or it can be a link to the audio description. Audio descriptions describe important visual elements that can't be understood from the main soundtrack alone - if provided in text it should annotate a transcript of the main soundtrack"
        }
    },

    inlineerror: {
        recommendation: "For inline error messages that appear either: onblur/focus movement, or when the related form field is in focus and an error has been detected; we recommend setting the error message as the accessible description of the related form field. The ARIA-DESCRIBEDBY attribute can be used to provide an accessible description.",
        resources: [
            "https://www.tpgi.com/simple-standalone-toggletip-widget-pattern/"
        ]
    },

    grouping: {
        issues: "This content is visually grouped, but this grouping",
        recommendation: "We recommend either:\n- wrapping this content in a native HTML FIELDSET element, with a LEGEND element.\n- adding the attribute ROLE=GROUP to an element wrapping this content\nAdditionally, the GROUP will need an accessible name, which should be the same as the text that visually labels it."
    },

    form: {
        group: {
            relatedsc: ["1.3.1"],
            issues: "These form fields are visually grouped, but this grouping is not programmatically determinable.",
            requirement: "Ensure that when content is visually grouped, this grouping can be programmatically determined.",
            recommendation: "We recommend either:\n- wrapping this content in a native HTML FIELDSET element, with a LEGEND element (provides an accessible name to the FIELDSET).\n- adding the attribute ROLE=GROUP to an element wrapping this content and providing it an accessible name.\n\nNote that GROUPs need an accessible name otherwise they are not exposed to users. For a FIELDSET element, the LEGEND element provides an accessible name. For ROLE=GROUP, ARIA-LABEL or ARIA-LABELLEDBY can be used."
        },
        errors: {
            null: {
                issues: "While errors are detected, the form fields in error are not identified and the error described in text."
            },
            message: {
                relatedsc: ['3.3.1', '4.1.3'],
                issues: "While errors are detected and described in text, they are not implemented in a way such that AT can relay this message to users when it is populated.",
                requirement: "Ensure that AT can notify users of error messages.",
                recommendation: "We recommend adding a list of errors at the top of the form where:\n- each list item identifies the form field in error with a link to the form field, and notes the error\n- focus is shifted onto the list of errors on form submission\nWe also recommend (in addition to the above) adding inline errors to each form field in error and associating that error with the form field as an accessible description - this can be done by adding ARIA-DESCRIBEDBY to the form field.",
                resources: [
                    "https://webaim.org/techniques/formvalidation/#form"
                ]
            }
        }
    },

    thirdparty: {
        recommendation: "Content that is powered by code from a 3rd party vendor (such as YouTube, Twitter, etc.) must have a disclaimer added before it. The disclaimer should point out what aspect of this content is beyond your control. It should also give direct contact information so that users who have trouble accessing this content can get help easily.\n\nDisclaimers should come before the content in question, and must conform to WCAG. We recommend displaying disclaimers as either plain text, or a toggletip. We have added a link in the Resources section that demonstrates a toggletip.",
        resources: [
            "https://www.tpgi.com/simple-standalone-toggletip-widget-pattern/"
        ]
    },

    skiplink: {
        requirement: "Ensure that there is a mechanism available to bypass blocks of content that have been repeated across multiple pages.\n\nWe recommend implementing a 'skip link'. Skip links typically take the form of an ANCHOR element named something similar to 'Skip to content', and when activated moves focus past the repeated block of content.",
        resources: [
            "https://webaim.org/techniques/skipnav/"
        ]
    },

    mobile: {
        role: {
            issues: "This component is interactive, but it is not identified as such.",
            requirement: "Ensure that interactive components are exposed by AT as such to users. When components have the appropriate role, the role may be exposed to users, but it should always provide the hint 'double-tap to activate'.",
            recommendation: "We recommend using a native elements that have an appropriate/interactive role where possible."
        }
    }
}

