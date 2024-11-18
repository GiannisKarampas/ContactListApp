/* eslint-env node */
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
     //stop looking for configs
    root: true,
    "rules": {
      // checks for class and function spelling issues
      "@typescript-eslint/naming-convention": [
        "error",
        { "selector": ["method", "variableLike"], "format": ["camelCase"] },
        { "selector": ["typeLike"], "format": ["PascalCase"] }
      ],
     
     
      /**
       * forms such as var foo = require("foo") are banned.
       * Instead use ES6 style imports or import foo = require("foo") imports.
       * options: error, warn, off
       */
      "@typescript-eslint/no-var-requires": "off",
   
      /**
       * If a variable is never reassigned, using the const declaration is better.
       * options: error, warn, off
       */
      "prefer-const": ["off", {
          "destructuring": "any",
          "ignoreReadBeforeAssign": true
      }],
   
      "@typescript-eslint/ban-types" : "error",
   
      /**
       * TypeScript is able to infer the types of parameters, properties, and variables
       * from their default or initial values. There is no need to use an explicit : type annotation on one of
       * those constructs initialized to a boolean, number, or string. Doing so adds unnecessary verbosity to
       * code -making it harder to read- and in some cases can prevent TypeScript from inferring a more specific
       * literal type (e.g. 10) instead of the more general primitive type (e.g. number)
       */
      "@typescript-eslint/no-inferrable-types" : "error",
   
      //Enable or disable single or double quote error checking
      "quotes": ["off", "double"],
     
      /**
       * This rule is aimed at discouraging the use of var and encouraging the use of const or let instead.
       * Incorrect use:
       * var x = "y";
       * var CONFIG = {};
       * Correct use
       * let x = "y";
       * const CONFIG = {};
       * In addition to non-ES6 environments, existing projects that are beginning to
       * introduce ES6 into their codebase may not want to apply this rule if the cost of migrating
       * from var to let is too costly.
       */
      "no-var": "off",
   
      /**
       * This rule disallows empty block statements. This rule ignores block statements which contain
       * a comment (for example, in an empty catch or finally block of a try statement to indicate that
       * execution should continue regardless of errors).
       * If you intentionally use empty block statements then you can disable this rule.
       */
      "no-empty": ["error", {
        "allowEmptyCatch": true
      }],
   
      // Rule for comment formating according to official guide for Chubbs Testing CoE.
      "multiline-comment-style": ["error", "starred-block"],
   
      // Rule for not allowing inline comments
      "no-inline-comments": "error",
   
      //No magic numbers
      "no-magic-numbers": "warn",
   
      //Do not allow variable length less than 2 characters
      "id-length": "warn"
  }
  };
  