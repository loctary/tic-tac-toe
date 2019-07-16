module.exports = {
  "parser": "babel-eslint",
  "env": {
      "browser": true,
      "es6": true,
      "jest": true
  },
  "extends": [
    "airbnb",
    "prettier",
    "prettier/react"
  ],
  "globals": {
      "Atomics": "readonly",
      "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
      "ecmaFeatures": {
          "jsx": true
      },
      "ecmaVersion": 2018,
      "sourceType": "module"
  },
  "plugins": [
      "react",
      "prettier"
  ],
  "rules": {
      "prettier/prettier": [
        "error",
        {
          "trailingComma": "es5",
          "singleQuote": true,
          "printWidth": 120,
        }
      ],
      "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
      "jsx-a11y/label-has-associated-control": [ "error", {
          "required": {
            "some": [ "nesting", "id"  ]
          }
        }],
        "jsx-a11y/label-has-for": [ "error", {
          "required": {
            "some": [ "nesting", "id"  ]
          }
        }]
  },
  "settings": {
    "import/resolver": {
      "node": {
        "paths": ["src"]
      }
    }
  }
};