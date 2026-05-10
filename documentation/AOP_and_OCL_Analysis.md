# AOP and OCL Implementation in QuickPay Microservice Project

## Executive Summary
The QuickPay microservice project demonstrates practical implementations of **Aspect-Oriented Programming (AOP)** and **Object Constraint Language (OCL)** concepts within a Spring Boot architecture. While explicit AOP frameworks aren't used, Spring's built-in AOP features are leveraged extensively for cross-cutting concerns. OCL is realized through validation constraints and business logic rules.

---

## I. Aspect-Oriented Programming (AOP) Implementation

### 1. Centralized Exception Handling (Primary AOP Pattern)

**What it solves:** Code tangling - handling errors scattered across multiple methods
**AOP Terminology:**
- **Aspect:** ErrorController / GlobalExceptionHandler classes
- **Join Point:** Method execution in controllers
- **Pointcut:** Methods annotated with @ExceptionHandler
- **Advice:** The exception handling logic that executes when an exception occurs
- **Advice Type:** After Throwing (implicit - executes when exception is thrown)

#### Example 1: Auth Service Exception Handler
**File:** `auth-service/src/main/java/com/core/authservice/controller/ErrorController.java`

```java
@ControllerAdvice
@Slf4j
public class ErrorController {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIErrorResponse> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException ex) {
        // This @ExceptionHandler acts as AFTER-THROWING ADVICE
        // It intercepts validation exceptions and transforms them uniformly
        return new ResponseEntity<>(
            APIErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("The server cannot process the request due to client error")
                .errors(ex.getBindingResult().getAllErrors().stream()
                    .map(e -> new APIErrorResponse.FieldError(
                        ((FieldError) e).getField(), 
                        e.getDefaultMessage()
                    ))
                    .toList()
                )
                .build(), 
            HttpStatus.BAD_REQUEST);
    }
}
```

**How it demonstrates AOP:**
- **Cross-cutting concern:** Error handling appears in every service (transaction-service, wallet-service, etc.)
- **Centralization:** Without AOP, each controller would duplicate this error handling logic
- **Weaving:** Spring automatically "weaves" this advice into the application at runtime
- **Benefit:** Changes to error handling logic only need to be made in one place

#### Example 2: Transaction Service Global Exception Handler
**File:** `transaction-service/src/main/java/com/lodex/transactionservice/exception/GlobalExceptionHandler.java`

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MaxTransferAmountExceeded.class)
    public ResponseEntity<Map<String, String>> handleMaxTransferAmountExceeded(
            MaxTransferAmountExceeded ex) {
        // AFTER-THROWING ADVICE for business logic violations
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", ex.getMessage()));
    }
    
    @ExceptionHandler(DuplicateTransactionException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateTransactionException(
            DuplicateTransactionException ex) {
        // Handles idempotency violations
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", ex.getMessage()));
    }
}
```

**Multiple exception types handled as separate join points:**
- Each @ExceptionHandler is a separate pointcut matching specific exception types
- Promotes clean code by separating business logic from error handling

---

### 2. JPA Lifecycle Hooks (Implicit AOP)

**What it solves:** Boilerplate code for automatic timestamp management
**AOP Characteristics:** 
- These are framework-provided aspects that automatically intercept entity lifecycle events
- **Join Points:** Entity persistence lifecycle events
- **Advice Type:** Before (BEFORE PERSIST/UPDATE)

#### Example: Automatic Timestamp Management
**File:** `notification-service/src/main/java/com/core/notificationservice/model/Notification.java`

```java
@Entity
@Table(name="notifications")
public class Notification {
    
    @Column(nullable = false)
    private Instant createdAt;
    
    @Column(nullable = false)
    private Instant updatedAt;

    private Instant readAt;
    
    @PrePersist  // BEFORE ADVICE - executes before insert
    public void prePersist() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }
    
    @PreUpdate   // BEFORE ADVICE - executes before update
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}
```

**How it demonstrates AOP:**
- **Cross-cutting concern:** Every entity might need timestamp management
- **Automated weaving:** JPA/Hibernate automatically calls these methods (similar to Spring AOP weaving)
- **Avoids code duplication:** Without this, you'd manually set timestamps in service methods
- **Transparent:** The entity lifecycle management happens automatically

---

### 3. Spring Security Filters (Implicit AOP)

**What it solves:** Authentication and authorization concerns scattered across endpoints
**AOP Characteristics:**
- **Join Point:** Request processing in the servlet chain
- **Advice Type:** Around Advice
- **Pointcut:** All protected endpoints

#### Example: JWT Header Filter in API Gateway
**File:** `api-gateway/src/main/java/com/core/apigateway/filters/JwtHeaderFilter.java`

This filter acts as **AROUND ADVICE** - it wraps the entire request/response cycle:
```
Before: Extract and validate JWT from headers
Around: Pass request to downstream services
After: Return response
```

---

### 4. Transaction Management (Implicit AOP)

**File:** `auth-service/src/main/java/com/core/authservice/service/UserService.java`

```java
@Service
@RequiredArgsConstructor
public class UserService {
    
    @Transactional  // This annotation triggers Spring's AOP proxy
    public void changePassword(String subject, ChangePasswordRequest request) {
        User user = userRepository.findById(UUID.fromString(subject))
            .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password does not match");
        }
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        // Transaction is automatically committed if no exception occurs
        // Transaction is automatically rolled back if exception occurs
    }
}
```

**How it demonstrates AOP:**
- **Cross-cutting concern:** Transaction management (begin, commit, rollback)
- **Advice Type:** Around Advice
- **Weaving:** Spring creates a proxy around the method to manage transactions
- **Benefit:** Business logic stays clean; transaction logic is handled transparently

---

## II. Object Constraint Language (OCL) Implementation

OCL is expressed in this project through **validation constraints** and **business logic rules** rather than explicit OCL syntax. These enforce what "must be true" about the data.

### 1. Field-Level Constraints (Invariants)

**OCL Concept:** Invariants - conditions that must always be true

#### Example 1: Phone Number Constraints
**File:** `auth-service/src/main/java/com/core/authservice/dto/SignupRequest.java`

```java
public record SignupRequest(
    
    @NotBlank(message = "Phone number is required")
    @Pattern(
        regexp = "^(010|011|012|015)\\d{8}$",
        message = "Phone number must start with 010, 011, 012, or 015 and has 11 digits"
    )
    @UniquePhoneNumber  // Custom constraint
    String phoneNumber,
    
    @NotBlank(message = "First name is required")
    @Length(max = 50, message = "First name is too long")
    @Pattern(
        regexp = "^[\\p{L}\\h]+$",
        message = "First Name must contain only letters and cannot include numbers"
    )
    String firstName,
    
    // Similar constraints for lastName and password
) {}
```

**OCL Equivalent (UML/Formal notation):**
```
context SignupRequest inv:
    self.phoneNumber->notEmpty() and
    self.phoneNumber->matches("^(010|011|012|015)\\d{8}$") and
    self.phoneNumber->isUnique() and
    self.firstName->notEmpty() and
    self.firstName->size() <= 50
```

**Constraint Breakdown:**
| Constraint | Type | OCL Equivalent |
|-----------|------|----------------|
| `@NotBlank` | Invariant | `self.phoneNumber->notEmpty()` |
| `@Pattern(regexp=...)` | Invariant | Format validation: `self.matches("pattern")` |
| `@UniquePhoneNumber` | Invariant | Uniqueness: `self->isUnique()` |
| `@Length(max=50)` | Invariant | Size constraint: `self->size() <= 50` |

#### Example 2: Transfer Amount Constraints
**File:** `transaction-service/src/main/java/com/lodex/transactionservice/model/dto/TransferRequestDTO.java`

```java
@Data
public class TransferRequestDTO {
    
    private String senderId;
    
    @NotBlank(message = "Receiver phone number is required")
    @Pattern(regexp = "^01\\d{9}$", message = "Invalid phone number")
    private String receiverPhoneNumber;
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Transfer amount must be greater than zero")
    private BigDecimal amount;
}
```

**OCL Equivalent:**
```
context TransferRequestDTO inv:
    self.receiverPhoneNumber->notEmpty() and
    self.receiverPhoneNumber->matches("^01\\d{9}$") and
    self.amount->notNull() and
    self.amount > 0
```

---

### 2. Custom Validation Constraints

**OCL Concept:** Custom constraint validators for complex business rules

#### Example: Unique Phone Number Validator
**File:** `auth-service/src/main/java/com/core/authservice/util/UniquePhoneNumber.java`

```java
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniquePhoneNumberValidator.class)
public @interface UniquePhoneNumber {
    String message() default "Phone number must be unique";
    // ...
}
```

**Implementation:**
**File:** `auth-service/src/main/java/com/core/authservice/util/UniquePhoneNumberValidator.java`

```java
public class UniquePhoneNumberValidator implements ConstraintValidator<UniquePhoneNumber, String> {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public boolean isValid(String phoneNumber, ConstraintValidatorContext context) {
        if (phoneNumber == null || phoneNumber.isEmpty()) return true;
        return !userRepository.existsByPhoneNumber(phoneNumber);  // Checks database
    }
}
```

**OCL Equivalent:**
```
context User inv:
    User.allInstances()->select(u | u.phoneNumber = self.phoneNumber)->size() <= 1
    -- All instances of User where phoneNumber matches this one should be at most 1
```

**What it validates:** Uniqueness constraint across the entire database

---

### 3. Preconditions and Postconditions

**OCL Concept:** Pre and post conditions on operations

#### Example 1: Transaction Creation Preconditions
**File:** `transaction-service/src/main/java/com/lodex/transactionservice/service/TransactionService.java`

```java
public Transaction createTransaction(TransferRequestDTO dto, String idempotencyKey) {
    // PRECONDITIONS (must be true before execution)
    
    // Pre: Idempotency key must not have been processed before
    if (transactionDAO.existsByIdempotencyKey(idempotencyKey)) {
        throw new DuplicateTransactionException(
            "Transaction with key " + idempotencyKey + " already processed."
        );
    }
    
    // Pre: Receiver must exist in system
    User receiver = userDAO.findByPhoneNumber(dto.getReceiverPhoneNumber());
    if(receiver == null) throw new UserNotFoundException(
        "No user with such phone number"
    );
    
    // Pre: Transfer amount must not exceed maximum allowed
    if (amount.compareTo(fees.maxTransferAmount()) > 0) {
        throw new MaxTransferAmountExceeded(
            String.format("Max transfer amount exceeded. Max allowed: %s, attempted: %s",
                fees.maxTransferAmount(), amount)
        );
    }
    
    // BUSINESS LOGIC EXECUTION
    Transaction newTransaction = transactionMapper.toEntity(dto, idempotencyKey);
    newTransaction.setStatus(TransactionStatus.PENDING);
    Transaction insertedTransaction = transactionDAO.save(newTransaction);
    
    // POSTCONDITION (guaranteed to be true after execution)
    // Post: A transaction record must exist in database with PENDING status
    // Post: A message must be published to Kafka for wallet service
    kafkaProducerService.produceTransactionCreatedEvent(insertedTransaction);
    
    return insertedTransaction;
}
```

**OCL Equivalent:**
```
context TransactionService::createTransaction(dto: TransferRequestDTO, idempotencyKey: String)
pre:
    not Transaction.allInstances()->exists(t | t.idempotencyKey = idempotencyKey) and
    User.allInstances()->exists(u | u.phoneNumber = dto.receiverPhoneNumber) and
    dto.amount <= self.maxTransferAmount

post:
    Transaction.allInstances()->exists(t | 
        t.idempotencyKey = idempotencyKey and 
        t.status = TransactionStatus.PENDING
    )
```

#### Example 2: Notification Timestamp Postconditions
**File:** `notification-service/src/main/java/com/core/notificationservice/model/Notification.java`

```java
@PrePersist
public void prePersist() {
    // POSTCONDITION GUARANTEE:
    // After this method, createdAt and updatedAt will always be set
    Instant now = Instant.now();
    this.createdAt = now;
    this.updatedAt = now;
}

@PreUpdate
public void preUpdate() {
    // POSTCONDITION GUARANTEE:
    // After every update, updatedAt reflects current time
    this.updatedAt = Instant.now();
}
```

**OCL Equivalent:**
```
context Notification::prePersist()
post:
    self.createdAt->notNull() and
    self.updatedAt->notNull() and
    self.createdAt = self.updatedAt
    
context Notification::preUpdate()
post:
    self.updatedAt = now()
```

---

### 4. Database-Level Constraints

**OCL Concept:** Structural constraints enforced at the database schema level

#### Example: Column Constraints
**File:** `auth-service/src/main/java/com/core/authservice/domain/User.java`

```java
@Entity
@Table(name="users")
public class User {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(unique = true, nullable = false)
    private String phoneNumber;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole role;
}
```

**OCL Equivalent (Invariants on User class):**
```
context User inv:
    self.phoneNumber->notNull() and
    self.phoneNumber->isUnique() and
    self.password->notNull() and
    self.role->notNull()
```

---

### 5. Status Constraints (Enumerated Invariants)

**OCL Concept:** Collection operations and enumeration constraints

**File:** `notification-service/src/main/java/com/core/notificationservice/domain/NotificationStatus.java`

```java
public enum NotificationStatus {
    UNREAD,   // Constraint: Status must be one of these values
    READ      // Constraint: No other values are permitted
}
```

```java
@Column(nullable = false)
@Enumerated(EnumType.STRING)
@Builder.Default
private NotificationStatus status = NotificationStatus.UNREAD;
```

**OCL Equivalent:**
```
context Notification inv:
    self.status = NotificationStatus::UNREAD or 
    self.status = NotificationStatus::READ
```

---

## III. Relationship Between AOP and OCL

| Aspect | AOP | OCL |
|--------|-----|-----|
| **Purpose** | Handle cross-cutting concerns (logging, security, transactions) | Enforce business rules and constraints |
| **Implementation** | Framework-based (Spring AOP, filters, interceptors) | Validation annotations & business logic |
| **Execution Time** | Runtime, transparent to business logic | At data validation/persistence time |
| **Example** | Error handling in ErrorController | @NotNull, @Positive constraints |
| **Separation of Concerns** | Separates infrastructure concerns from business logic | Separates validation from business operations |

---

## IV. Summary Table: AOP and OCL Findings

### AOP Implementations Found

| Pattern | Location | Advice Type | Cross-Cutting Concern |
|---------|----------|------------|----------------------|
| Exception Handling | ErrorController, GlobalExceptionHandler | After Throwing | Error handling |
| JPA Lifecycle | Notification.java | Before | Timestamp management |
| Security Filters | API Gateway, Filters | Around | Authentication/Authorization |
| @Transactional | UserService.java | Around | Transaction management |

### OCL Implementations Found

| Constraint Type | Example | Mechanism |
|-----------------|---------|-----------|
| Invariants | @NotNull, @NotBlank, @Pattern | JSR-380 Annotations |
| Uniqueness | @UniquePhoneNumber | Custom ConstraintValidator |
| Range/Bounds | @Positive, @Length | JSR-380 Annotations |
| Preconditions | User exists check in TransactionService | Conditional logic + exceptions |
| Postconditions | @PrePersist timestamp setting | JPA lifecycle hooks |
| Enum Constraints | NotificationStatus, TransactionStatus | Enumerated types |

---

## V. Key Takeaways for Presentation

1. **AOP reduces code duplication** by centralizing cross-cutting concerns (exceptions, security, transactions)
2. **OCL ensures data quality** through constraints at DTOs, entities, and business logic layers
3. **Spring Boot provides implicit AOP** through annotations and filters, not requiring explicit aspect classes
4. **Validation happens at multiple levels:**
   - DTO validation (input validation)
   - Custom validators (business rule validation)
   - Entity constraints (data integrity)
   - Service layer preconditions (workflow validation)
5. **The project demonstrates practical AOP** without traditional AspectJ syntax, using Spring's convenient annotations

