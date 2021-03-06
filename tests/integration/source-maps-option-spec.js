var testDirectory = 'source-maps-option-test-suite';
var integrationTest = require('./helpers/jasmine-wrapper.js');
var test = new integrationTest.Test(integrationTest.TestType.Undecided, testDirectory);

test.describeIntegrationTest("Generating source maps:", function() {

    beforeEach(function() {

        test.given.StagingDirectoryIs('staging-dir');
        test.given.OutputDirectoryIs('output-dir');

        test.given.CommandLineOption('-sourcemaps');
        test.given.CommandLineOption('-siterootdirectory:' + test.given.BaseTestDirectory);

    });

    describe("Js files", function () {

        beforeEach(function () {
            test.resetTestType(integrationTest.TestType.Js);
        });

        it("Given source maps option and JSX file, then JSX is compiled with inline source maps.", function () {

            test.given.FileToBundle('file1.jsx',
                'var file1 = React.createClass({'
                + '   render: function() {'
                + '   return <div>file1 {this.props.name}</div>;'
                + '  }'
                + '});');

            test.actions.Bundle();

            test.assert.verifyFileAndContentsAre(
                test.given.StagingDirectory + '/testjs',
                'test-file1.js',
                '"use strict";\n' +
                '\n' +
                'var file1 = React.createClass({\n' +
                '  displayName: "file1",\n' +
                '  render: function render() {\n' +
                '    return React.createElement(\n' +
                '      "div",\n' +
                '      null,\n' +
                '      "file1 ",\n' +
                '      this.props.name\n' +
                '    );\n' +
                '  } });\n' +
                '//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi90ZXN0L2ZpbGUxLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7O0FBQUksUUFBTSxFQUFFLGtCQUFXO0FBQUksV0FBTzs7OztNQUFZLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSTtLQUFPLENBQUM7R0FBRyxFQUFDLENBQUMsQ0FBQyJ9'
            );

        });

        it("Given source maps option and ES6 file, then ES6 is compiled with inline source maps.", function () {

            test.given.FileToBundle('file1.es6',
                'var odds = evens.map(v => v + 1);');

            test.actions.Bundle();

            test.assert.verifyFileAndContentsAre(
                test.given.StagingDirectory + '/testjs',
                'test-file1.js',
                '"use strict";\n' +
                '\n' +
                'var odds = evens.map(function (v) {\n' +
                '  return v + 1;\n' +
                '});\n' +
                '//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi90ZXN0L2ZpbGUxLmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO1NBQUksQ0FBQyxHQUFHLENBQUM7Q0FBQSxDQUFDLENBQUMifQ=='
            );

        });

        it('Given source maps option and JS files, then combined unminified bundle JS is created with inline source map.', function() {

            test.given.FileToBundle(
                'file1.jsx',
                'var file1 = React.createClass({'
                + '   render: function() {'
                + '   return <div>file1 {this.props.name}</div>;'
                + '  }'
                + '});'
            );
            test.given.FileToBundle(
                'file2.js',
                'var x = 1;'
            );

            test.actions.Bundle();

            test.assert.verifyFileAndContentsAre(
                test.given.StagingDirectory + '/testjs',
                'test.js',
                ';"use strict";\n' +
                '\n' +
                'var file1 = React.createClass({\n' +
                '  displayName: "file1",\n' +
                '  render: function render() {\n' +
                '    return React.createElement(\n' +
                '      "div",\n' +
                '      null,\n' +
                '      "file1 ",\n' +
                '      this.props.name\n' +
                '    );\n' +
                '  } });\n' +
                ';var x = 1;\n\n' +
                '//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi90ZXN0L2ZpbGUxLmpzeCIsIi90ZXN0L2ZpbGUyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7QUFBSSxRQUFNLEVBQUUsa0JBQVc7QUFBSSxXQUFPOzs7O01BQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJO0tBQU8sQ0FBQztHQUFHLEVBQUMsQ0FBQyxDQUFDO0FDQXpHIn0='
            )

        });

        it('Given source maps option and JS files, then combined minified bundle JS is created with inline source map.', function() {

            test.given.FileToBundle(
                'file1.jsx',
                'var file1 = React.createClass({'
                + '   render: function() {'
                + '   return <div>file1 {this.props.name}</div>;'
                + '  }'
                + '});'
            );
            test.given.FileToBundle(
                'file2.js',
                'var x = 1;'
            );

            test.actions.Bundle();

            test.assert.verifyBundleIs(
                ';"use strict";var file1=React.createClass({displayName:"file1",render:function(){return React.createElement("div",null,"file1 ",this.props.name)}});\n' +
                ';var x=1;\n\n' +
                '//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi90ZXN0L2ZpbGUxLmpzeCIsIi90ZXN0L2ZpbGUyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJZQUFBLElBQUksT0FBUSxNQUFNLGlDQUFnQixPQUFRLFdBQWUsTUFBTyxPQUFBLGtDQUFZLEtBQUssTUFBTTtBQ0F2RixHQUFJLEdBQUk7QURBUixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOztBQUFJLFFBQU0sRUFBRSxrQkFBVztBQUFJLFdBQU87Ozs7TUFBWSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUk7S0FBTyxDQUFDO0dBQUcsRUFBQyxDQUFDLENBQUMifQ=='
            )

        });

    });

    describe("Css Files", function () {

        beforeEach(function () {
            test.resetTestType(integrationTest.TestType.Css);
        });

        it("Given source maps option and less file, then less is compiled with inline source maps.", function () {

            test.given.FileToBundle('less1.less',
                '@color: red;\n.less1 { color: @color; }');

            test.actions.Bundle();

            test.assert.verifyFileAndContentsAre(
                test.given.StagingDirectory + '/testcss',
                'test-less1.css',
                '.less1 {\n' +
                '  color: red;\n' +
                '}\n' +
                '\n' +
                '/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi90ZXN0L2xlc3MxLmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFBUyxVQUFBIn0= */'
            );

        });

        it('Given source maps option and CSS files, then combined unminified bundle CSS is created with inline source map.', function() {

            test.given.FileToBundle(
                'file1.less',
                '@color: red;\n.less1 { color: @color; }'
            );
            test.given.FileToBundle(
                'file2.css',
                '.foo { background: green; }'
            );

            test.actions.Bundle();

            test.assert.verifyFileAndContentsAre(
                test.given.StagingDirectory + '/testcss',
                'test.css',
                '.less1 {\n' +
                '  color: red;\n' +
                '}\n\n' +
                '.foo { background: green; }\n\n' +
                '/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi90ZXN0L2ZpbGUxLmxlc3MiLCIvdGVzdC9maWxlMi5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFBUyxVQUFBOzs7QUNEVCJ9 */'
            )

        });

        it('Given source maps option and CSS files, then combined minified bundle CSS is created with inline source map.', function() {

            test.given.FileToBundle(
                'file1.less',
                '@color: red;\n.less1 { color: @color; }'
            );
            test.given.FileToBundle(
                'file2.css',
                '.foo { background: green; }'
            );

            test.actions.Bundle();

            test.assert.verifyBundleIs(
                '.less1{color:red}\n' +
                '.foo{background:green}\n\n' +
                '/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi90ZXN0L2ZpbGUxLmxlc3MiLCIvdGVzdC9maWxlMi5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBUyxNQUFBO0FDRFQsS0FBTyxXQUFZIn0= */'
            )

        });

    });
});
