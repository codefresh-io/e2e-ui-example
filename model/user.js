var helper      = require('./../module/helper.js');
var github      = require('./../providers/github.js');
var bitbucket   = require('../providers/bitbucket.js');
var cst         = require('./../module/utils.js');

var constant = new cst.Constant();
var self;

var User = function (user, screenshots) {
    this.type = user.type;
    this.username = process.env[user.username];
    this.password = process.env[user.password];
    this.screenshots = screenshots;
    self = this;
};

User.prototype.login2 = function (callback) {
    self = this;
    browser.wait(function() {
        return browser.driver.isElementPresent(by.xpath(constant.XPATH_LOGIN));
    }, constant.DEFAULT_TIMEOUT).then(
        function () {
            var btnLogin = helper.findElement(by.xpath(constant.XPATH_LOGIN));
            btnLogin.click().then(function () {
                console.log('Click on the button Login');
            });
            signIn({
                'github':{'xpath': constant.XPATH_GITHUB_SIGNIN},
                'bitbucket':{'xpath': constant.XPATH_BITBUCKET_SIGNIN}
            }, callback);
        }, function() {
            browser.driver.isElementPresent(by.xpath(constant.XPATH_GITHUB_SIGNUP)).then(function (present) {
                console.log('isExist:' + present);
                if(present) {
                    signIn({
                        'github':{'xpath': constant.XPATH_GITHUB_SIGNUP},
                        'bitbucket':{'xpath': constant.XPATH_BITBUCKET_SIGNUP}
                    }, callback);
                } else {
                    loggedIn(callback);
                }
            });
        });
};

var getXpathByProviderName = function (jsonData, provider) {
    if(provider == 'github') {
        return jsonData.github.xpath;
    } else if(provider == 'bitbucket') {
        return jsonData.bitbucket.xpath;
    }

    return 'invalid_xpath';
};

var signIn = function (jsonData, callback) {
    var xpath = getXpathByProviderName(jsonData, self.type);
    browser.wait(function() {
        return browser.driver.isElementPresent(by.xpath(xpath));
    }, constant.DEFAULT_TIMEOUT).then(
        function () {
            var btnSignIn = helper.findElement(by.xpath(xpath));
            btnSignIn.click();
            if(self.type == 'github') {
                github.signIn(self, self.screenshots, function () {
                    browser.driver.wait(function () {
                        return browser.driver.isElementPresent(by.xpath(constant.XPATH_USER_DROPDOWN));
                    }, constant.DEFAULT_TIMEOUT).then(
                        function () {
                            callback();
                        },
                        function () {
                            callback();
                        }
                    );
                });
            } else if(self.type == 'bitbucket') {
                console.log('bitbucket login');
                bitbucket.signIn(self, self.screenshots, function () {
                    browser.driver.wait(function () {
                        return browser.driver.isElementPresent(by.xpath(constant.XPATH_USER_DROPDOWN));
                    }, constant.DEFAULT_TIMEOUT).then(
                        function () { callback(); },
                        function () { callback(); }
                    );
                });
            }
        }, function () {
            loggedIn(callback);
        });
};

User.prototype.login = function(callback) {
    self = this;
    browser.driver.wait(function() {
        return !browser.driver.isElementPresent(by.xpath(constant.XPATH_LOGIN));
    }, 3000).then(
        function () {
            loggedIn(callback);
        },
        function() {
            var btnLogin = helper.findElement(by.xpath(constant.XPATH_LOGIN));
            btnLogin.click().then(function () {
                console.log('Click on the button Login ');
            });

            browser.wait(function() {
                return browser.driver.isElementPresent(by.xpath(constant.XPATH_GITHUB_SIGNIN));
            }, constant.DEFAULT_TIMEOUT).then(
                function () {
                    var btnGithubSignIn = helper.findElement(by.xpath(constant.XPATH_GITHUB_SIGNIN));
                    btnGithubSignIn.click();

                    github.signIn(self, self.screenshots, function () {
                        helper.waitForHandleElement(by.xpath(constant.XPATH_USER_DROPDOWN), 10000, function () {
                            callback();
                        }, function () { });
                    });
                }, function () {
                    loggedIn(callback);
                });
        });
};

var loggedIn = function (callback) {
    var formatStr = helper.format(constant.XPATH_USER_DROPDOWN_TEXT, self.username);
    browser.driver.isElementPresent(by.xpath(formatStr)).then(function (present) {
        console.log('logged');
        if(!present) {
            self.logout();
            self.login(callback);
        } else callback();
    });
};

User.prototype.logout = function () {
    browser.driver.isElementPresent(by.xpath(constant.XPATH_USER_DROPDOWN)).then(function (present) {
        console.log('Logout from account');
        var user_dropdown = helper.findElement(by.xpath(constant.XPATH_USER_DROPDOWN));
        user_dropdown.click();
        helper.sleep(1000);

        var logout = helper.findElement(by.xpath(constant.XPATH_LOGOUT));
        logout.click();

        helper.waitForElement(by.xpath(constant.XPATH_GITHUB_SIGNUP), constant.DEFAULT_TIMEOUT);
    });
};

User.prototype.isLogged = function () {
    browser.driver.isElementPresent();
};

module.exports.User = User;