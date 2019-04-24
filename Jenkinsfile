pipeline {
  agent any  
  options { 
    disableConcurrentBuilds() 
    timeout(time: 10, unit: 'MINUTES') 
  }
  stages {
    stage('Build') {
      agent {
        docker {
          image 'node:8-alpine'
          args '-v /var/yarn/cache:/root/yarn/cache'
        }
      }
      environment {
        YARN_CACHE_FOLDER = '/root/yarn/cache'
        BUILD_VERSION = """
          ${sh(
                returnStdout: true,
                script: 'date +%Y%m%d_%H%M%S_%Z@${GIT_LOCAL_BRANCH}-${GIT_COMMIT:0:7}'
            )}
          """.trim()
      }
      steps {
       sh '''
      cd express-app
      yarn install --no-progress --pure-lockfile
      '''
      sh '''
      cd jumbo-react
      yarn install --no-progress --pure-lockfile
      '''
      sh '''      
      cd express-app
      yarn compile --no-progress
      '''
      }
    }
    stage('Dockerize') {
      agent any
      environment {
        BUILD_VERSION = """
          ${sh(
              returnStdout: true,
              script: 'date +%Y%m%d_%H%M%S_%Z@${GIT_LOCAL_BRANCH}-${GIT_COMMIT:0:7}'
          )}
          """.trim()
      }
      options { skipDefaultCheckout() }
      steps {      
        script {
          def ecr_url = env.ECR_REGISTRY
          def branch = env.GIT_LOCAL_BRANCH
          docker.withRegistry("https://${ecr_url}", 'ecr:ap-northeast-2:AWS_IAM_User_jenkins') {
            def commitID = env.GIT_COMMIT.substring(0,7)
            def image = docker.build("legal:${branch}-${commitID}", "--build-arg BUILD_VERSION=${env.BUILD_VERSION} .")
            image.push()
            image.push("latest")
            image.push("${branch}-latest")
          }
        }

      }
    }
    stage('Deploy') {
      steps {
         script {
          def branch = env.GIT_LOCAL_BRANCH
          def commitID = env.GIT_COMMIT.substring(0,7)
          def server = ''
          def key = ''

          switch(branch) {
            case 'dev':
            case 'master':
              server = env.AWS_IP_DEV
              key = 'AWS_Key_Dev_Web'
              break;
            
            case 'prod':
              server = env.AWS_IP_PROD
              key = 'AWS_Key_Web'
              break;
          }
          
          sshagent(credentials: [key]) {
            sh """
              ssh -o StrictHostKeyChecking=no -l ec2-user ${server} " \
                  cd /home/ec2-user/Tools/legal_${branch} && \
                  ./deploy.sh ${branch}-${commitID} "
              """

          }
         }
      }
    }
  }
}
