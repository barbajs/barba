/* eslint-disable */
const kebab = '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$'

/**
 * Rules organisation
 *
 * 1. Possible errors
 * 2. Limit language features
 * 3. Stylistic issues
 */
module.exports = {
  ignoreFiles: ['src/styles/vendor/**/*.scss'],
  plugins: ['stylelint-order'],
  rules: {
    /**
     * 1. Possible errors
     */
    // Color
    'color-no-invalid-hex': true,
    // Font family
    'font-family-no-duplicate-names': true,
    'font-family-no-missing-generic-family-keyword': true,
    // Function
    'function-calc-no-invalid': true,
    'function-calc-no-unspaced-operator': true,
    'function-linear-gradient-no-nonstandard-direction': true,
    // String
    'string-no-newline': true,
    // Unit
    'unit-no-unknown': true,
    // Property
    'property-no-unknown': true,
    // Keyframe declaration
    'keyframe-declaration-no-important': true,
    // Declaration block
    'declaration-block-no-duplicate-properties': true,
    'declaration-block-no-shorthand-property-overrides': true,
    // Block
    'block-no-empty': true,
    // Selector
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-element-no-unknown': true,
    'selector-type-no-unknown': [
      true,
      {
        ignore: ['custom-elements'],
      },
    ],
    // Media feature
    'media-feature-name-no-unknown': true,
    // At-rule
    // Comment
    'comment-no-empty': true,
    // General / Sheet
    'no-descending-specificity': true,
    'no-duplicate-at-import-rules': true,
    'no-duplicate-selectors': true,
    'no-empty-source': true,
    'no-extra-semicolons': true,
    'no-invalid-double-slash-comments': true,
    /**
     * 2. Limit language features
     */
    // Color
    'color-named': 'never',
    // Function
    'function-url-no-scheme-relative': true,
    // Keyframes
    'keyframes-name-pattern': kebab,
    // Number
    'number-max-precision': 3,
    // Time
    'time-min-milliseconds': 100,
    // Shorthand property
    'shorthand-property-no-redundant-values': true,
    // Value
    'value-no-vendor-prefix': true,
    // Custom property
    'custom-property-pattern': kebab,
    // Property
    'property-no-vendor-prefix': true,
    // Declaration
    'declaration-block-no-redundant-longhand-properties': true,
    'declaration-no-important': true,
    // Declaration block
    'declaration-block-single-line-max-declarations': 1,
    // Selector
    'selector-class-pattern': kebab,
    'selector-id-pattern': kebab,
    'selector-max-attribute': 3,
    'selector-max-class': 4,
    'selector-max-combinators': 2,
    'selector-max-compound-selectors': 3,
    'selector-max-empty-lines': 0,
    'selector-max-id': 0,
    'selector-max-pseudo-class': 3,
    // 'selector-max-specificity': '0,6,2',
    'selector-max-type': 2,
    'selector-max-universal': 2,
    'selector-no-qualifying-type': [true, { ignore: ['attribute', 'class'] }],
    // Media feature
    'media-feature-name-no-vendor-prefix': true,
    // Custom media
    'custom-media-pattern': kebab,
    // At-rule
    'at-rule-no-vendor-prefix': true,
    'at-rule-whitelist': [
      'charset',
      'use',
      'forward',
      'import',
      'mixin',
      'include',
      'function',
      'extend',
      'at-root',
      'return',
      'error',
      'warn',
      'debug',
      'if',
      'else',
      'each',
      'for',
      'while',
    ],
    // Comment
    // General / Sheet
    'max-nesting-depth': 3,
    'no-unknown-animations': true,
    /**
     * 3. Stylistic issues
     */
    // Color
    'color-hex-case': 'lower',
    'color-hex-length': 'short',
    // Font family
    'font-family-name-quotes': 'always-where-recommended',
    // Font weight
    'font-weight-notation': 'numeric',
    // Function
    'function-comma-newline-after': 'always-multi-line',
    'function-comma-newline-before': 'never-multi-line',
    'function-comma-space-after': 'always-single-line',
    'function-comma-space-before': 'never',
    'function-max-empty-lines': 0,
    'function-name-case': 'lower',
    'function-parentheses-newline-inside': 'always-multi-line',
    'function-parentheses-space-inside': 'never-single-line',
    'function-url-quotes': 'always',
    'function-whitespace-after': 'always',
    // Number
    'number-leading-zero': 'always',
    'number-no-trailing-zeros': true,
    // String
    'string-quotes': 'single',
    // Length
    'length-zero-no-unit': true,
    // Unit
    'unit-case': 'lower',
    // Value
    'value-keyword-case': 'lower',
    // Value list
    'value-list-comma-newline-after': 'always-multi-line',
    'value-list-comma-newline-before': 'never-multi-line',
    'value-list-comma-space-after': 'always-single-line',
    'value-list-comma-space-before': 'never',
    'value-list-max-empty-lines': 0,
    // Custom property
    'custom-property-empty-line-before': [
      'always',
      {
        except: ['after-comment', 'after-custom-property', 'first-nested'],
        ignore: ['after-comment', 'first-nested', 'inside-single-line-block'],
      },
    ],
    // Property
    'property-case': 'lower',
    // Declaration
    'declaration-bang-space-after': 'never',
    'declaration-bang-space-before': 'always',
    'declaration-colon-newline-after': 'always-multi-line',
    'declaration-colon-space-after': 'always-single-line',
    'declaration-colon-space-before': 'never',
    'declaration-empty-line-before': [
      'always',
      { except: ['after-comment', 'after-declaration', 'first-nested'] },
    ],
    // Declaration block
    'declaration-block-semicolon-newline-after': 'always',
    'declaration-block-semicolon-newline-before': 'never-multi-line',
    'declaration-block-semicolon-space-after': 'always-single-line',
    'declaration-block-semicolon-space-before': 'never',
    'declaration-block-trailing-semicolon': 'always',
    // Block
    'block-closing-brace-empty-line-before': 'never',
    'block-closing-brace-newline-after': [
      'always',
      {
        ignoreAtRules: ['if', 'else'],
      },
    ],
    'block-closing-brace-newline-before': 'always-multi-line',
    'block-closing-brace-space-after': 'always-single-line',
    'block-closing-brace-space-before': 'always-single-line',
    // 'block-opening-brace-newline-after': 'always-multi-line',
    // 'block-opening-brace-newline-before': 'always-multi-line',
    'block-opening-brace-space-after': 'always-single-line',
    'block-opening-brace-space-before': 'always-single-line',
    // Selector
    'selector-attribute-brackets-space-inside': 'never',
    'selector-attribute-operator-space-after': 'never',
    'selector-attribute-operator-space-before': 'never',
    'selector-attribute-quotes': 'always',
    'selector-combinator-space-after': 'always',
    'selector-combinator-space-before': 'always',
    'selector-descendant-combinator-no-non-space': true,
    'selector-pseudo-class-case': 'lower',
    'selector-pseudo-class-parentheses-space-inside': 'never',
    'selector-pseudo-element-case': 'lower',
    'selector-pseudo-element-colon-notation': 'double',
    'selector-type-case': 'lower',
    // Selector list
    'selector-list-comma-newline-after': 'always-multi-line',
    'selector-list-comma-newline-before': 'never-multi-line',
    'selector-list-comma-space-after': 'always-single-line',
    'selector-list-comma-space-before': 'never',
    // Rule
    'rule-empty-line-before': [
      'always',
      {
        except: ['after-single-line-comment', 'first-nested'],
        ignore: ['after-comment'],
      },
    ],
    // Media feature
    'media-feature-colon-space-after': 'always',
    'media-feature-colon-space-before': 'never',
    'media-feature-name-case': 'lower',
    'media-feature-parentheses-space-inside': 'never',
    'media-feature-range-operator-space-after': 'always',
    'media-feature-range-operator-space-before': 'always',
    // Media query list
    'media-query-list-comma-newline-after': 'always-multi-line',
    'media-query-list-comma-newline-before': 'never-multi-line',
    'media-query-list-comma-space-after': 'always-single-line',
    'media-query-list-comma-space-before': 'never-single-line',
    // At-rule
    'at-rule-empty-line-before': [
      'always',
      {
        except: [
          'blockless-after-same-name-blockless',
          'blockless-after-blockless',
          'first-nested',
        ],
        ignore: ['after-comment'],
        ignoreAtRules: ['else'],
      },
    ],
    'at-rule-name-case': 'lower',
    'at-rule-name-newline-after': 'always-multi-line',
    'at-rule-name-space-after': 'always-single-line',
    'at-rule-semicolon-newline-after': 'always',
    'at-rule-semicolon-space-before': 'never',
    // Comment
    'comment-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment', 'stylelint-commands'],
      },
    ],
    'comment-whitespace-inside': 'always',
    // General / Sheet
    indentation: [
      2,
      {
        baseIndentLevel: 1,
        indentClosingBrace: false,
      },
    ],
    linebreaks: 'unix',
    'max-empty-lines': 1,
    'max-line-length': [120, { ignore: ['comments'] }],
    'no-eol-whitespace': true,
    'no-missing-end-of-source-newline': true,
    'no-empty-first-line': true,

    /**
     * stylelint-order
     * https://www.npmjs.com/package/stylelint-order
     */
    'order/order': [
      [
        'dollar-variables',
        'custom-properties',
        {
          type: 'at-rule',
          name: 'extend',
        },
        {
          type: 'at-rule',
          name: 'include',
        },
        'declarations',
        {
          type: 'at-rule',
          name: 'include',
          parameter: 'mq',
        },
        'rules',
      ],
      { unspecified: 'bottom' },
    ],
    'order/properties-order': [
      [
        {
          groupName: 'position',
          emptyLineBefore: 'never',
          noEmptyLineBetween: true,
          properties: ['position', 'z-index', 'top', 'right', 'bottom', 'left'],
        },
        {
          groupName: 'box',
          emptyLineBefore: 'never',
          noEmptyLineBetween: true,
          properties: [
            'display',
            'grid',
            'grid-template',
            'grid-template-areas',
            'grid-template-rows',
            'grid-template-columns',
            'grid-auto-rows',
            'grid-auto-columns',
            'grid-auto-flow',
            'grid-gap',
            'grid-row-gap',
            'grid-column-gap',
            'flex-flow',
            'flex-direction',
            'flex-wrap',
            'justify-content',
            'align-content',
            'align-items',
            'grid-area',
            'grid-row',
            'grid-row-start',
            'grid-row-end',
            'grid-column',
            'grid-column-start',
            'grid-column-end',
            'flex',
            'flex-grow',
            'flex-shrink',
            'flex-basis',
            'order',
            'align-self',
            'overflow',
            'overflow-x',
            'overflow-y',
            'float',
            'clear',
            'box-sizing',
            'width',
            'min-width',
            'max-width',
            'height',
            'min-height',
            'max-height',
            'margin',
            'margin-top',
            'margin-right',
            'margin-bottom',
            'margin-left',
            'padding',
            'padding-top',
            'padding-right',
            'padding-bottom',
            'padding-left',
          ],
        },
        {
          groupName: 'typo',
          emptyLineBefore: 'never',
          noEmptyLineBetween: true,
          properties: [
            'color',
            'font',
            'font-family',
            'src',
            'font-size',
            'font-smoothing',
            'font-style',
            'font-variant',
            'font-weight',
            'line-height',
            'text-align',
            'text-decoration',
            'text-indent',
            'text-overflow',
            'text-shadow',
            'text-transform',
            'white-space',
            'letter-spacing',
            'word-spacing',
          ],
        },
        {
          groupName: 'visual',
          emptyLineBefore: 'never',
          noEmptyLineBetween: true,
          properties: [
            'background',
            'background-attachment',
            'background-clip',
            'background-color',
            'background-image',
            'background-origin',
            'background-position',
            'background-repeat',
            'background-size',
            'border',
            'border-top',
            'border-right',
            'border-bottom',
            'border-left',
            'border-width',
            'border-style',
            'border-color',
            'border-top-width',
            'border-top-style',
            'border-top-color',
            'border-right-width',
            'border-right-style',
            'border-right-color',
            'border-bottom-width',
            'border-bottom-style',
            'border-bottom-color',
            'border-left-width',
            'border-left-style',
            'border-left-color',
            'border-radius',
            'box-shadow',
            'outline',
            'opacity',
          ],
        },
        {
          groupName: 'animation',
          emptyLineBefore: 'never',
          noEmptyLineBetween: true,
          properties: [
            'transition',
            'transition-delay',
            'transition-duration',
            'transition-property',
            'transition-timing-function',
            'animation',
            'animation-delay',
            'animation-direction',
            'animation-duration',
            'animation-fill-mode',
            'animation-iteration-count',
            'animation-name',
            'animation-play-state',
            'animation-timing-function',
          ],
        },
      ],
    ],
  },
}
