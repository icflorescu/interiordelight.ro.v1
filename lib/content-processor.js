var md = require('markdown');

/**
 * Generate project "intro" by looking for an '[end intro]' string in the original description.
 * Adds a "…" character to the intro if necessary.
 * An MD-to-HTML transformation is performed on the intro text.
 *
 * Also explicitely deletes the original description (to save memory -> is this necessary?).
 *
 * Example:
 *
 *   project.content.en.description: 'Lorem ipsum [end intro] dolor sit amet'
 *
 *   ---------------------------------------------------------------------------
 *
 *   => project.content.en.intro: 'Lorem ipsum…'
 *   => project.content.en.descrition is deleted
 *
 */
exports.intro = function(project, lang) {
	var content = project.content[lang];

	content.intro = content.description.replace(/\s*\[end\s*intro\](.|\s)*/i, '');
	delete content.description;
	if (content.intro.substring(content.intro.length - 1) !== '.') {
		content.intro += '…';
	}
	content.intro = md.markdown.toHTML(content.intro);
};

/**
 * Generates project description tokens (where token = text + group of pics),
 * by looking for '[x pictures]' strings in the original description.
 * An MD-to-HTML transformation is performed for each token text item.
 *
 * Also explicitely deletes the full description (to save memory -> is this necessary?).
 *
 * Example:
 *
 *   project.content.en.description:
 *        'Lorem ipsum [end intro] dolor sit amet, consectetur adipiscing elit.
 *         [2 pictures]
 *         Vivamus congue odio.'
 *
 *   project.contentImages:
 *         [ img1, img2, img3, img4 ]
 *
 *   ---------------------------------------------------------------------------
 *
 *   =>  project.content.en.tokens: [ {
 *	       text: 'Lorem ipsum [end intro] dolor sit amet, consectetur adipiscing elit.',
 *         pictures: [ img1, img2 ]
 *       }, {
 *	       text: 'Vivamus congue odio.',
 *         pictures: [ img3, img4 ]
 *       } ]
 *
 *   =>  project.content.en.descrition deleted
 *
 */
exports.project = function(project, lang) {
	var content = project.content[lang],
		i = 0,
		splitResults, splitResultsLength, token;

	splitResults = content.description.replace(/\s*\[end\s*intro\]/i, '')
		.split(/\s*(\[(\d+)\s*pictures?\])\s*/i);
	delete content.description;
	content.descriptionTokens = [];
	splitResultsLength = splitResults.length;
	for (; i < splitResultsLength; i += 3) {
		token = {};
		if (splitResults[i] !== '') {
			token.text = md.markdown.toHTML(splitResults[i]);
		}
		if (splitResultsLength > i + 1) {
			token.pictures = project.contentPictures.splice(0, splitResults[i + 2]);
		} else {
			token.pictures = project.contentPictures;
			delete project.contentPictures;
		}
		content.descriptionTokens.push(token);
	}
};
