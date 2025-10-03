# System Test Plan
## SNMP Monitoring System

### 1. Test Overview

#### 1.1 Test Objectives
- Verify all system components work correctly
- Validate SNMP communication between manager and agents
- Test web client functionality
- Ensure Docker and Kubernetes deployments work
- Verify CI/CD pipeline execution

#### 1.2 Test Scope
- Functional testing of all components
- Integration testing of end-to-end workflows
- Performance testing of API responses
- Deployment testing in Docker and Kubernetes
- Error handling and edge case testing

### 2. Test Environment Setup

#### 2.1 Prerequisites
- Docker Desktop installed and running
- Node.js 18+ installed
- Kubernetes cluster (minikube/kind for local testing)
- Git repository access

#### 2.2 Test Data
- 5 SNMP agents with predefined metrics
- Sample metric values for validation
- Test user scenarios for web client

### 3. Test Cases

#### 3.1 Component Testing

**TC-1: SNMP Agent Startup**
- **Objective**: Verify all agents start successfully
- **Steps**:
  1. Run `docker compose up -d --build`
  2. Check container status with `docker ps`
  3. Verify all 5 agents are running
- **Expected Result**: All containers show "Up" status
- **Priority**: High

**TC-2: Manager API Health Check**
- **Objective**: Verify manager API is accessible
- **Steps**:
  1. Start manager: `cd apps/manager && npm install && npm start`
  2. Test endpoint: `curl http://localhost:3001/health`
- **Expected Result**: Returns `{"status":"ok","timestamp":"..."}`
- **Priority**: High

**TC-3: Web Client Startup**
- **Objective**: Verify web client loads correctly
- **Steps**:
  1. Start client: `cd apps/client && npm install && npm run dev`
  2. Open http://localhost:3000
- **Expected Result**: Dashboard loads with service/metric dropdowns
- **Priority**: High

#### 3.2 Integration Testing

**TC-4: End-to-End Metric Query**
- **Objective**: Verify complete metric query workflow
- **Steps**:
  1. Select service: "inventory"
  2. Select metric: "stockLevel"
  3. Click "Fetch Metric"
- **Expected Result**: Returns JSON with service, key, value, timestamp
- **Priority**: High

**TC-5: Multi-Service Query**
- **Objective**: Test all 5 services
- **Steps**:
  1. Test inventory: stockLevel, stockOutEvents
  2. Test orders: ordersPerMin, activeOrders
  3. Test payments: paymentsPerMin, activePaymentSessions
  4. Test users: activeUsers, authSuccessRate
  5. Test notifications: notificationsPerMin, activeQueues
- **Expected Result**: All services return valid metric values
- **Priority**: High

**TC-6: SNMP Communication**
- **Objective**: Verify SNMP protocol communication
- **Steps**:
  1. Check agent logs for SNMP requests
  2. Verify OID resolution works correctly
  3. Test with direct SNMP commands
- **Expected Result**: SNMP requests processed successfully
- **Priority**: Medium

#### 3.3 Error Handling Testing

**TC-7: Invalid Service Parameter**
- **Objective**: Test error handling for invalid service
- **Steps**:
  1. Call API: `GET /metrics?service=invalid&key=test`
- **Expected Result**: Returns 400 error with message
- **Priority**: Medium

**TC-8: Invalid Metric Key**
- **Objective**: Test error handling for invalid metric
- **Steps**:
  1. Call API: `GET /metrics?service=inventory&key=invalid`
- **Expected Result**: Returns 404 error with message
- **Priority**: Medium

**TC-9: Agent Unavailable**
- **Objective**: Test behavior when agent is down
- **Steps**:
  1. Stop an agent container
  2. Try to query that service
- **Expected Result**: Returns 500 error gracefully
- **Priority**: Medium

#### 3.4 Performance Testing

**TC-10: API Response Time**
- **Objective**: Verify API meets performance requirements
- **Steps**:
  1. Measure response time for metric queries
  2. Test with multiple concurrent requests
- **Expected Result**: Response time < 2 seconds
- **Priority**: Medium

**TC-11: Concurrent Users**
- **Objective**: Test system under load
- **Steps**:
  1. Simulate 10 concurrent metric queries
  2. Monitor system performance
- **Expected Result**: All requests complete successfully
- **Priority**: Low

#### 3.5 Deployment Testing

**TC-12: Docker Compose Deployment**
- **Objective**: Verify complete system deployment
- **Steps**:
  1. Run `docker compose up -d --build`
  2. Start manager and client
  3. Test full workflow
- **Expected Result**: All components work together
- **Priority**: High

**TC-13: Kubernetes Deployment**
- **Objective**: Verify K8s deployment works
- **Steps**:
  1. Apply K8s manifests: `kubectl apply -f k8s/`
  2. Check pod status: `kubectl get pods -n sdn-project`
  3. Test service connectivity
- **Expected Result**: All pods running, services accessible
- **Priority**: Medium

#### 3.6 CI/CD Testing

**TC-14: GitHub Actions Pipeline**
- **Objective**: Verify automated testing works
- **Steps**:
  1. Push code to repository
  2. Check GitHub Actions execution
  3. Verify Docker images are built
- **Expected Result**: Pipeline completes successfully
- **Priority**: Medium

**TC-15: DockerHub Publishing**
- **Objective**: Verify images are published
- **Steps**:
  1. Check DockerHub for published images
  2. Verify image tags are correct
- **Expected Result**: Images available on DockerHub
- **Priority**: Low

### 4. Test Execution

#### 4.1 Test Phases
1. **Unit Testing**: Individual component testing
2. **Integration Testing**: Component interaction testing
3. **System Testing**: End-to-end workflow testing
4. **Deployment Testing**: Docker and Kubernetes testing
5. **Performance Testing**: Load and stress testing

#### 4.2 Test Schedule
- **Week 1**: Unit and integration testing
- **Week 2**: System and deployment testing
- **Week 3**: Performance and CI/CD testing
- **Week 4**: Bug fixes and retesting

### 5. Test Results

#### 5.1 Test Metrics
- **Pass Rate**: Target 95% for all test cases
- **Performance**: API response time < 2 seconds
- **Availability**: System uptime > 99%
- **Coverage**: All functional requirements tested

#### 5.2 Defect Management
- **Critical**: System doesn't start or core functionality fails
- **High**: Major feature doesn't work as expected
- **Medium**: Minor feature issues or performance problems
- **Low**: Cosmetic issues or minor improvements

### 6. Test Deliverables

#### 6.1 Test Reports
- Daily test execution reports
- Weekly test summary reports
- Final test completion report
- Defect tracking report

#### 6.2 Test Artifacts
- Test case execution logs
- Performance test results
- Deployment verification screenshots
- CI/CD pipeline execution logs

### 7. Test Environment Cleanup

#### 7.1 Post-Test Cleanup
- Stop all Docker containers
- Remove Kubernetes resources
- Clean up test data
- Reset environment to initial state

#### 7.2 Test Data Management
- Backup test results before cleanup
- Archive test logs for future reference
- Document any environment-specific issues
