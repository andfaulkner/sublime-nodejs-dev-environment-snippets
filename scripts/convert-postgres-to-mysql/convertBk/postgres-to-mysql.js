var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var colors = require('colors');
var XRegExp = require('xregexp').XRegExp;
_.merge(XRegExp, require('xregexp-lookbehind'));
var spawn = require('child_process').spawn;

var rootDir = process.cwd();
var pgToMySqlPath = path.join(rootDir, 'script/database/mysql/lib/pg2mysql/pg2mysql_cli.php');
var sqlPath = path.join(rootDir, 'script/database/latest.sql');

var mysqlEngine = process.env.MYSQL_ENGINE || 'MyISAM';
var mySQLBannedColNames = [
	'data',
	'details',
	'exclude',
	'fields',
	'files',
	'key',
	'parents',
	'trigger'
];


/***
*
*   spawn process to run external postgres --> mysql tool, & handle its output stream
*
*/
var convertSqlProcessHandler = function convertSqlProcessHandler(){
	var sqlOut = '';

	var pgToMySql = spawn('php', [pgToMySqlPath, sqlPath]);

	pgToMySql.stdout.on('data', function (data) {
		var dataString = data.toString();
	  sqlOut = sqlOut + dataString;
	});

	pgToMySql.on('close', function (code) {
	  console.log('child process exited with code ' + code);
	  cleanSqlOut(null, sqlOut);
	});
};


_.mixin({
	prependLine: function(origStr, strToPrepend){
		return strToPrepend + '\n' + origStr;
	},
	//Note: you're going to need to strip out the postgres-emitted
	//sql mode setting and glue it into the var to make it also use other
	//sql modes. Otherwise we could just set vars in my.cnf
	addSQLModes: function(sqlTextFile, modesArr, isGlobal){
		//SQL command to append modes:
		//	SET sql_mode=(SELECT CONCAT(@@sql_mode,',<mode_to_add>'));
		//SQL cmd to remove individual modes:
		//	SET sql_mode=(SELECT REPLACE(@@sql_mode,'<mode_to_remove>',''));
		//Grab existing SQL modes here
		//create 'set sql modes' command
		//prepend sql modes text command to sql file text & return it
		return strToPrepend + '\n' + origStr;
	}
})

// example of XRegExp usage
// var fieldNameToField = function fieldNameToField(fieldName){
//     return (XRegExp.replaceLb(fieldName, '(?<=[A-Za-z0-9])', /\s./g, function($1) {
//             return $1.charAt(1).toUpperCase();
//         })).replace(/^(.)/g, function($1) {
//             return $1.toLowerCase();
//         }).replace(/\?$/g, '');
// };


function readTextFile(path, callback) {
    try {
        var filename = require.resolve(path);
        fs.readFile(filename, 'utf8', callback);
    } catch (e) {
    		console.error(e);
        callback(e);
    }
}

// readTextFile('./lib/pg2mysql/latest-mysql.sql', cleanSqlOut);

var cleanSqlOut = function cleanSqlOut(err, words) {
	var wordsOrig = words;
	var altered = _.chain(words)

	  //TODO: Actually, do this in a my.cnf file.
		// .prependLine('SET GLOBAL sql_mode=ALLOW_INVALID_DATES')

		//Make the mysql engine reference legal, and set the engine to that
		//specified in an environment variable (or a default if not present)
		.replace(/\)\sTYPE\=MyISAM/g, ') ENGINE=' + mysqlEngine)

		//Capitalize the word JSON (readability)
		.replace(/\sjson\[\],/g,' JSON,')

	  //Disallow commas directly before brackets.
		.replace(/,[\s\n\r\t\f]+\)/g, '\n)')

		//For debugging
		.tap(function(str){
			console.log(str);
		})
		.value();
};


convertSqlProcessHandler();












//Regex graveyard
		// .replace(/\sjson\[\]/g,' JSON,')
	  // .replace(/,[^\w]+\)/g, ',\n)')
		// .replace(/,[^\w~`,!@#%^&_=<>"';:\$\*\\\/\|\+-\.\[\]\?]+\)/g, '\n)')