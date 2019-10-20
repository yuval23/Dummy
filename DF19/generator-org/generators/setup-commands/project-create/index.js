const Generator = require('yeoman-generator');
const shell = require('shelljs');
const githubUsername = require('github-username');
const chalk = require('chalk');
const yosay = require('yosay');


module.exports = class extends Generator {
  
  initializing() {

  }

 async prompting() { 
   
        const answers = await this.prompt([
          {
            type: "input",
            name: "projectName",
            message: "Your project name",
            default: "MyProject"
          },
          {
            type: "input",
            name: "appFolder",
            message: "App folder name",
            default: 'force-app'
          },
          {
            type: "input",
            name: "appNamespace",
            message: "Namespace (optional)",
            default: 'force-app'
          },
          {
            type    : 'input',
            name    : 'apiVersion', 
            message : 'API version',
            default : "46.0"
          },
          {
            type    : 'confirm',
            name    : 'includeManifest', 
            message : 'Include Manifest file',
            default : false
          }
      ]).then((answers) => {
      this.log("=========================");
      this.answers = answers;

      //shell.exec('sfdx force:project:create -n ' + this.answers.projectName + ' -p ' +this.answers.appFolder );
      let sfdxCommand = ' sfdx force:project:create';
        sfdxCommand += ' -n ' + this.answers.projectName;
        if(this.answers.appFolder)
        sfdxCommand += ' -p ' + this.answers.appFolder; // --defaultpackagedir DEFAULTPACKAGEDIR Default value: force-app
        // if(this.answers.projectPath)
        // sfdxCommand += ' -d ' + this.answers.projectPath;  //  --outputdir OUTPUTDIR Type: string
        if(this.answers.appNamespace)
        sfdxCommand += ' -s ' + this.answers.appNamespace;  //  --namespace NAMESPACE Type: string
        sfdxCommand += ' -t ' + 'standard';   // --template 
        sfdxCommand += ' -x ' + this.answers.projectPath; //--manifest Type: boolean
        // --template The template to use to create the project. Supplied parameter values or default values are filled into a copy of the template.
    if(this.allanswers.devhubName)
      sfdxCommand += ' -v ' + this.allanswers.devhubName;
    
      sfdxCommand += ' -u ' + this.allanswers.scratchOrgName;
  
    shell.exec(sfdxCommand);
      this.log("========================="); 
      });
  }

  configuring() {
  
  }

  writing() {
    this.log( chalk.blue('creating the project structure for ' + this.answers.projectName));
    shell.mkdir('-p', this.destinationRoot() + "/" + this.answers.projectName + "/config");
    shell.mkdir('-p', this.destinationRoot() + "/" + this.answers.projectName + "/.vscode");
    shell.mkdir('-p', this.destinationRoot() + "/" + this.answers.projectName + "/"+this.answers.appFolder+"/main/default/applications");
    shell.mkdir('-p', this.destinationRoot() + "/" + this.answers.projectName + "/"+this.answers.appFolder+"/main/default/aura");
    shell.mkdir('-p', this.destinationRoot() + "/" + this.answers.projectName + "/"+this.answers.appFolder+"/main/default/classes");
    shell.mkdir('-p', this.destinationRoot() + "/" + this.answers.projectName + "/"+this.answers.appFolder+"/main/default/flexipages");
    shell.mkdir('-p', this.destinationRoot() + "/" + this.answers.projectName + "/"+this.answers.appFolder+"/main/default/layouts");
    shell.mkdir('-p', this.destinationRoot() + "/" + this.answers.projectName + "/"+this.answers.appFolder+"/main/default/lwc");
    shell.mkdir('-p', this.destinationRoot() + "/" + this.answers.projectName + "/"+this.answers.appFolder+"/main/default/objects");
    shell.mkdir('-p', this.destinationRoot() + "/" + this.answers.projectName + "/"+this.answers.appFolder+"/main/default/permissionsets");
    shell.mkdir('-p', this.destinationRoot() + "/" + this.answers.projectName + "/"+this.answers.appFolder+"/main/default/staticresources");
    shell.mkdir('-p', this.destinationRoot() + "/" + this.answers.projectName + "/"+this.answers.appFolder+"/main/default/tabs");
    shell.mkdir('-p', this.destinationRoot() + "/" + this.answers.projectName + "/"+this.answers.appFolder+"/main/default/triggers");
    this.log("=========================");
    // config files
     this.log(( chalk.green("Creating config for project...") ) );
     this.fs.copyTpl(
       this.templatePath('config/sfdx-project.json'),
       this.destinationPath(this.answers.projectName + '/sfdx-project.json'),
       { appPath:this.answers.appFolder,
         apiVersion:   this.answers.apiVersion
       }
     );

      // config files
      this.log(( chalk.green("Creating vscode files..") ) );
      this.fs.copyTpl(
        this.templatePath('vscode/extensions.json'),
        this.destinationPath(this.answers.projectName + '/.vscode/extensions.json'),
        {}
      );
      this.fs.copyTpl(
        this.templatePath('vscode/extensions.json'),
        this.destinationPath(this.answers.projectName + '/.vscode/launch.json'),
        {}
      );
      this.fs.copyTpl(
        this.templatePath('vscode/extensions.json'),
        this.destinationPath(this.answers.projectName + '/.vscode/settings.json'),
        {}
      );

      this.log(( chalk.green("Creating sfdx files..") ) );
      this.fs.copyTpl(
        this.templatePath('settings/.forceignore'),
        this.destinationPath(this.answers.projectName + '/.forceignore'),
        {}
      );
      this.fs.copyTpl(
        this.templatePath('settings/.prettierignore'),
        this.destinationPath(this.answers.projectName + '/.prettierignore'),
        {}
      );
      this.fs.copyTpl(
        this.templatePath('settings/.prettierrc'),
        this.destinationPath(this.answers.projectName + '/.prettierrc'),
        {}
      );
      this.fs.copyTpl(
        this.templatePath('settings/.gitignore'),
        this.destinationPath(this.answers.projectName + '/.gitignore'),
        {}
      );
      this.fs.copyTpl(
        this.templatePath('settings/README.md'),
        this.destinationPath(this.answers.projectName + '/README.md'),
        {}
      );
      
      // lwc files
      this.fs.copyTpl(
        this.templatePath('lwc/.eslintrc.json'),
        this.destinationPath(this.answers.projectName + '/'+this.answers.appFolder+'/main/default/lwc/.eslintrc.json'),
        {}
      );
 
  }

  end() {
  
      shell.cd( this.answers.projectName );
      this.log(yosay( chalk.green("Your project is ready!") + " launch VS Code") );
      shell.exec('code .');
      //return
      this.composeWith(require.resolve('../navigation'),
        { moduleName : 'app',
          questionLabel :'Go Home' }
        );
  }







};
