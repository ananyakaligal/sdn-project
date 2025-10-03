# Software Requirements Specification (SRS)
## SNMP Monitoring System

### 1. Introduction

#### 1.1 Purpose
This document specifies the requirements for a full-stack SNMP monitoring system that enables web-based querying of SNMP agents through a centralized manager.

#### 1.2 Scope
The system provides a web interface for users to query SNMP metrics from multiple microservice agents, with a REST API manager handling SNMP communication.

### 2. System Overview

#### 2.1 System Architecture
- **Web Client**: Next.js dashboard for user interaction
- **Web Server**: Node.js REST API for metric queries
- **SNMP Manager**: Handles SNMP protocol communication
- **SNMP Agents**: 5 microservices exposing metrics via SNMP
- **MIB**: Management Information Base for metric definitions

#### 2.2 Key Features
- Real-time metric querying from multiple services
- Web-based dashboard with service/metric selection
- SNMP GET request support
- Docker containerization for all components
- Kubernetes deployment support

### 3. Functional Requirements

#### 3.1 Web Client Requirements
- **FR-1**: Display service and metric selection dropdowns
- **FR-2**: Allow users to fetch metric values
- **FR-3**: Display query results with timestamps
- **FR-4**: Maintain query history
- **FR-5**: Handle API errors gracefully

#### 3.2 Manager API Requirements
- **FR-6**: Provide REST endpoint for metric queries
- **FR-7**: Support SNMP GET requests to agents
- **FR-8**: Return JSON responses with metric data
- **FR-9**: Handle multiple service types (inventory, orders, payments, users, notifications)
- **FR-10**: Provide health check endpoint

#### 3.3 SNMP Agent Requirements
- **FR-11**: Expose metrics via SNMP extend mechanism
- **FR-12**: Support SNMP GET requests
- **FR-13**: Return integer/string values for metrics
- **FR-14**: Run in Docker containers
- **FR-15**: Expose UDP port 161

### 4. Non-Functional Requirements

#### 4.1 Performance Requirements
- **NFR-1**: API response time < 2 seconds
- **NFR-2**: Support concurrent queries from multiple users
- **NFR-3**: Agent startup time < 30 seconds

#### 4.2 Reliability Requirements
- **NFR-4**: System availability > 99%
- **NFR-5**: Graceful error handling for agent failures
- **NFR-6**: Container restart capability

#### 4.3 Security Requirements
- **NFR-7**: CORS enabled for web client
- **NFR-8**: Input validation for API parameters
- **NFR-9**: Container isolation

### 5. System Components

#### 5.1 Web Client (Next.js)
- **Technology**: React, TypeScript, Tailwind CSS
- **Port**: 3000
- **Features**: Service selection, metric querying, result display

#### 5.2 Manager API (Node.js)
- **Technology**: Express.js, child_process
- **Port**: 3001
- **Features**: REST API, SNMP communication, Docker exec

#### 5.3 SNMP Agents (Docker)
- **Services**: inventory, orders, payments, users, notifications
- **Technology**: Ubuntu 22.04, Net-SNMP
- **Ports**: 161, 1161, 2161, 3161, 4161 (UDP)

### 6. API Specifications

#### 6.1 Manager API Endpoints

**GET /health**
- **Purpose**: Health check
- **Response**: `{"status": "ok", "timestamp": "ISO string"}`

**GET /metrics**
- **Purpose**: Query metric value
- **Parameters**: 
  - `service`: string (inventory|orders|payments|users|notifications)
  - `key`: string (metric name)
- **Response**: 
  ```json
  {
    "service": "inventory",
    "key": "stockLevel", 
    "value": 100,
    "timestamp": "2025-10-03T20:27:30.357Z"
  }
  ```

### 7. Deployment Requirements

#### 7.1 Docker Requirements
- **DR-1**: All components containerized
- **DR-2**: Docker Compose for local development
- **DR-3**: Multi-stage builds for optimization

#### 7.2 Kubernetes Requirements
- **KR-1**: Namespace isolation (sdn-project)
- **KR-2**: Resource limits and requests
- **KR-3**: Service discovery between components
- **KR-4**: LoadBalancer for web client access

#### 7.3 CI/CD Requirements
- **CD-1**: GitHub Actions for automated testing
- **CD-2**: Docker image building and pushing
- **CD-3**: Kubernetes deployment automation

### 8. Testing Requirements

#### 8.1 Unit Testing
- **TR-1**: Manager API endpoint testing
- **TR-2**: Client component testing
- **TR-3**: SNMP query validation

#### 8.2 Integration Testing
- **TR-4**: End-to-end metric querying
- **TR-5**: Multi-service agent testing
- **TR-6**: Error handling validation

### 9. DevOps Requirements

#### 9.1 Version Control
- **DV-1**: Git repository management
- **DV-2**: Branch protection rules
- **DV-3**: Pull request workflows

#### 9.2 Container Registry
- **DV-4**: DockerHub image publishing
- **DV-5**: Image tagging strategy
- **DV-6**: Security scanning

#### 9.3 Monitoring
- **DV-7**: Application health monitoring
- **DV-8**: Container resource monitoring
- **DV-9**: Log aggregation

### 10. Acceptance Criteria

#### 10.1 Functional Acceptance
- ✅ User can select service and metric from web interface
- ✅ User can fetch metric values successfully
- ✅ System returns accurate metric data
- ✅ Error handling works for invalid requests
- ✅ All 5 agent services are accessible

#### 10.2 Technical Acceptance
- ✅ All components run in Docker containers
- ✅ Kubernetes deployment works
- ✅ CI/CD pipeline executes successfully
- ✅ DockerHub images are published
- ✅ System meets performance requirements

### 11. Assumptions and Constraints

#### 11.1 Assumptions
- Docker and Kubernetes are available in target environment
- Network connectivity between components
- SNMP agents are stateless and can be restarted

#### 11.2 Constraints
- Limited to SNMP GET requests (no SET operations)
- Single manager instance (no clustering)
- UDP-only communication for SNMP
