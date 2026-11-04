# Tests

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start summary -->
116 tests · Passed 102 · Failed 0 · Skipped 6 · Not run 8

Acceptance criteria covered: 31/163 · passing: 22/163
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start tests -->
## Sprint 1

### US-001: Sign in with email and password

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-004 | App > [AC-004] redirects unauthenticated access to the sign-in screen | Unit | Passed | `frontend/src/App.test.tsx` |
| — | App > renders a screen inside the app shell and shows its menu | Unit | Passed | `frontend/src/App.test.tsx` |
| AC-001 | SignIn > [AC-001] stores the token and navigates home on success | Unit | Passed | `frontend/src/screens/SignIn.test.tsx` |
| AC-002 | SignIn > [AC-002] shows the generic message from the API | Unit | Passed | `frontend/src/screens/SignIn.test.tsx` |
| AC-003 | SignIn > [AC-003] shows the deactivated-account message from the API | Unit | Passed | `frontend/src/screens/SignIn.test.tsx` |
| AC-142 | SignIn > [AC-142] stores session_token in preference to fallbacks and navigates home | Unit | Passed | `frontend/src/screens/SignIn.test.tsx` |
| AC-143 | SignIn > [AC-143] does not store an empty token when no field has a value | Unit | Passed | `frontend/src/screens/SignIn.test.tsx` |
| AC-143 | SignIn > [AC-143] falls back to token when session_token is empty, never storing empty | Unit | Passed | `frontend/src/screens/SignIn.test.tsx` |
| AC-001 | test_ac001_login_returns_session_usable_by_me | Integration | Passed | `backend/tests/integration/test_auth.py` |
| AC-001 | test_ac001_me_without_valid_session_is_401 | Integration | Passed | `backend/tests/integration/test_auth.py` |
| AC-002 | test_ac002_wrong_password_and_unknown_email_give_same_message | Integration | Passed | `backend/tests/integration/test_auth.py` |
| AC-003 | test_ac003_deactivated_account_refused_with_admin_message | Integration | Passed | `backend/tests/integration/test_auth.py` |
| AC-003 | test_ac003_deactivated_account_with_wrong_password_stays_generic | Integration | Passed | `backend/tests/integration/test_auth.py` |
| AC-004 | test_ac004_only_bcrypt_hash_stored_and_password_not_logged | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | test_logout_invalidates_session | Integration | Passed | `backend/tests/integration/test_auth.py` |
| — | test_nfr001_responses_and_session_never_contain_password_or_hash | Integration | Passed | `backend/tests/integration/test_auth_nfr.py` |
| — | test_nfr002_email_is_case_insensitive_and_deactivated_hidden_without_password | Integration | Passed | `backend/tests/integration/test_auth_nfr.py` |
| — | test_nfr002_unknown_and_wrong_password_responses_identical | Integration | Passed | `backend/tests/integration/test_auth_nfr.py` |

### US-003: Permissions combine as a union across multiple roles

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-010 | test_ac010_me_for_employee_only_has_no_elevated_permissions | Integration | Passed | `backend/tests/integration/test_rbac.py` |
| AC-010 | test_ac010_me_returns_union_for_multi_role_user | Integration | Passed | `backend/tests/integration/test_rbac.py` |
| AC-011 | test_ac011_nfr004_403_identical_for_existing_and_unknown_record_ids | Integration | Passed | `backend/tests/integration/test_rbac.py` |
| AC-011 | test_ac011_nfr004_employee_only_gets_403_without_data_on_admin_endpoint | Integration | Passed | `backend/tests/integration/test_rbac.py` |
| AC-011 | test_ac011_non_admin_roles_cannot_manage_users[EMPLOYEE] | Integration | Passed | `backend/tests/integration/test_rbac.py` |
| AC-011 | test_ac011_non_admin_roles_cannot_manage_users[HR_ADMIN] | Integration | Passed | `backend/tests/integration/test_rbac.py` |
| AC-011 | test_ac011_non_admin_roles_cannot_manage_users[PROJECT_MANAGER] | Integration | Passed | `backend/tests/integration/test_rbac.py` |
| AC-011 | test_ac011_non_admin_roles_cannot_manage_users[REPORTING_MANAGER] | Integration | Passed | `backend/tests/integration/test_rbac.py` |
| AC-012 | test_ac012_adding_role_grants_access_on_next_request | Integration | Passed | `backend/tests/integration/test_rbac.py` |
| AC-012 | test_ac012_removing_role_revokes_access_on_next_request | Integration | Passed | `backend/tests/integration/test_rbac.py` |
| — | test_nfr004_unauthenticated_admin_request_is_401_without_data | Integration | Passed | `backend/tests/integration/test_rbac.py` |
| — | test_nfr021_only_five_fixed_roles_and_admin_cannot_create_others | Integration | Passed | `backend/tests/integration/test_rbac.py` |
| AC-010 | [AC-010] multi-role user sees both the employee and the manager/admin menus | E2E | Not run yet | `frontend/e2e/navigation-gating.spec.ts` |
| AC-011 | [AC-011] Employee-only user sees neither Team & Approvals nor Administration menus | E2E | Not run yet | `frontend/e2e/navigation-gating.spec.ts` |

### US-007: Immutable audit log of approvals, changes and admin actions

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-025 | test_ac025_approval_or_rejection_entry_has_required_fields | Integration | Skipped | `backend/tests/integration/test_audit_log.py` |
| AC-026 | test_ac026_edit_records_before_and_after_for_changed_fields | Integration | Passed | `backend/tests/integration/test_audit_log.py` |
| AC-026 | test_ac026_unchanged_fields_not_recorded | Integration | Passed | `backend/tests/integration/test_audit_log.py` |
| AC-027 | test_ac027_nfr010_database_refuses_update_and_delete | Integration | Passed | `backend/tests/integration/test_audit_log.py` |
| AC-027 | test_ac027_nfr010_no_write_verbs_on_collection[delete] | Integration | Passed | `backend/tests/integration/test_audit_log.py` |
| AC-027 | test_ac027_nfr010_no_write_verbs_on_collection[patch] | Integration | Passed | `backend/tests/integration/test_audit_log.py` |
| AC-027 | test_ac027_nfr010_no_write_verbs_on_collection[post] | Integration | Passed | `backend/tests/integration/test_audit_log.py` |
| AC-027 | test_ac027_nfr010_no_write_verbs_on_collection[put] | Integration | Passed | `backend/tests/integration/test_audit_log.py` |
| AC-027 | test_ac027_nfr010_no_write_verbs_on_single_entry[delete] | Integration | Passed | `backend/tests/integration/test_audit_log.py` |
| AC-027 | test_ac027_nfr010_no_write_verbs_on_single_entry[patch] | Integration | Passed | `backend/tests/integration/test_audit_log.py` |
| AC-027 | test_ac027_nfr010_no_write_verbs_on_single_entry[put] | Integration | Passed | `backend/tests/integration/test_audit_log.py` |
| AC-027 | test_ac027_user_deletion_cannot_erase_entries | Integration | Passed | `backend/tests/integration/test_audit_log.py` |
| AC-028 | test_ac028_nfr010_non_admin_roles_get_403[EMPLOYEE] | Integration | Passed | `backend/tests/integration/test_audit_log.py` |
| AC-028 | test_ac028_nfr010_non_admin_roles_get_403[HR_ADMIN] | Integration | Passed | `backend/tests/integration/test_audit_log.py` |
| AC-028 | test_ac028_nfr010_non_admin_roles_get_403[PROJECT_MANAGER] | Integration | Passed | `backend/tests/integration/test_audit_log.py` |
| AC-028 | test_ac028_nfr010_non_admin_roles_get_403[REPORTING_MANAGER] | Integration | Passed | `backend/tests/integration/test_audit_log.py` |
| AC-028 | test_ac028_system_admin_gets_200 | Integration | Passed | `backend/tests/integration/test_audit_log.py` |
| AC-028 | test_ac028_unauthenticated_is_401 | Integration | Passed | `backend/tests/integration/test_audit_log.py` |
| — | test_nfr008_passwords_never_appear_in_audit_entries | Integration | Passed | `backend/tests/integration/test_audit_log.py` |

### US-011: HR Admin maintains departments

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-039 | test_ac039_added_department_is_selectable | Integration | Passed | `backend/tests/integration/test_departments.py` |
| AC-040 | test_ac040_delete_unassigned_department_succeeds | Integration | Passed | `backend/tests/integration/test_departments.py` |
| AC-040 | test_ac040_delete_with_assigned_employees_refused_with_count | Integration | Skipped | `backend/tests/integration/test_departments.py` |
| AC-041 | test_ac041_departments_table_has_no_scoping_columns | Integration | Passed | `backend/tests/integration/test_departments.py` |
| AC-041 | test_ac041_one_shared_list_no_country_or_entity_variant | Integration | Passed | `backend/tests/integration/test_departments.py` |
| — | test_authz_non_hr_admin_cannot_create_department[EMPLOYEE] | Integration | Passed | `backend/tests/integration/test_departments.py` |
| — | test_authz_non_hr_admin_cannot_create_department[PROJECT_MANAGER] | Integration | Passed | `backend/tests/integration/test_departments.py` |
| — | test_authz_non_hr_admin_cannot_create_department[REPORTING_MANAGER] | Integration | Passed | `backend/tests/integration/test_departments.py` |
| — | test_authz_non_hr_admin_cannot_delete_department[EMPLOYEE] | Integration | Passed | `backend/tests/integration/test_departments.py` |
| — | test_authz_non_hr_admin_cannot_delete_department[PROJECT_MANAGER] | Integration | Passed | `backend/tests/integration/test_departments.py` |
| — | test_authz_non_hr_admin_cannot_delete_department[REPORTING_MANAGER] | Integration | Passed | `backend/tests/integration/test_departments.py` |
| — | test_authz_unauthenticated_is_401 | Integration | Passed | `backend/tests/integration/test_departments.py` |
| — | test_nfr022_single_shared_list_same_for_every_user | Integration | Passed | `backend/tests/integration/test_departments.py` |

### US-038: Single-language interface and consistent date/time display

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-135 | datetime > [AC-135] renders a timestamptz in the company timezone | Unit | Passed | `frontend/src/lib/datetime.test.ts` |
| AC-135 | datetime > [AC-135] uses one format for bare stamps and dates | Unit | Passed | `frontend/src/lib/datetime.test.ts` |
| AC-134 | [AC-134] no language selector on the sign-in screen | E2E | Not run yet | `frontend/e2e/single-language-timestamps.spec.ts` |
| AC-135 | [AC-135] [NFR-017] company-timezone formatting is independent of browser timezone | E2E | Not run yet | `frontend/e2e/single-language-timestamps.spec.ts` |
| AC-135 | [AC-135] the same instant renders identically across screens and in company timezone | E2E | Not run yet | `frontend/e2e/single-language-timestamps.spec.ts` |

## Sprint 2

### US-002: Administrator creates user accounts — no public self-registration

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-006 | Account creation is admin-only (no self-registration) > [AC-006] redirects an unauthenticated registration URL to the sign-in page | Unit | Passed | `frontend/src/screens/Administration.test.tsx` |
| AC-005 | Administration · Users & roles > [AC-005] creates a user via POST /api/admin/users with email, employee and roles, then shows the new active account | Unit | Passed | `frontend/src/screens/Administration.test.tsx` |
| AC-008 | Administration · Users & roles > [AC-008] hides the Users & roles and Audit tabs from a signed-in user without System Admin | Unit | Passed | `frontend/src/screens/Administration.test.tsx` |
| AC-008 | Administration · Users & roles > [AC-008] shows the Users & roles and Audit tabs to a System Admin | Unit | Passed | `frontend/src/screens/Administration.test.tsx` |
| AC-005 | test_ac005_create_returns_active_account_with_both_roles | Integration | Passed | `backend/tests/integration/test_user_creation.py` |
| AC-007 | test_ac007_duplicate_email_rejected_with_message | Integration | Passed | `backend/tests/integration/test_user_creation.py` |
| AC-008 | test_ac008_non_system_admin_gets_403_with_no_data[EMPLOYEE] | Integration | Passed | `backend/tests/integration/test_user_creation.py` |
| AC-008 | test_ac008_non_system_admin_gets_403_with_no_data[HR_ADMIN] | Integration | Passed | `backend/tests/integration/test_user_creation.py` |
| AC-008 | test_ac008_non_system_admin_gets_403_with_no_data[PROJECT_MANAGER] | Integration | Passed | `backend/tests/integration/test_user_creation.py` |
| AC-008 | test_ac008_non_system_admin_gets_403_with_no_data[REPORTING_MANAGER] | Integration | Passed | `backend/tests/integration/test_user_creation.py` |
| AC-008 | test_ac008_unauthenticated_create_is_401 | Integration | Passed | `backend/tests/integration/test_user_creation.py` |
| AC-009 | test_ac009_audit_entry_never_contains_password | Integration | Passed | `backend/tests/integration/test_user_creation.py` |
| AC-009 | test_ac009_create_edit_deactivate_each_produce_audit_entry | Integration | Passed | `backend/tests/integration/test_user_creation.py` |
| AC-006 | [AC-006] the sign-in screen itself exposes no self-registration affordance | E2E | Not run yet | `frontend/e2e/no-self-registration.spec.ts` |

### US-004: Access scoped by relationship, not only by role

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-013 | test_ac013_foreign_employee_id_is_refused_403_with_no_data | Integration | Passed | `backend/tests/integration/test_relationship_scoping.py` |
| AC-013 | test_ac013_manager_with_no_reports_gets_empty_team | Integration | Passed | `backend/tests/integration/test_relationship_scoping.py` |
| AC-013 | test_ac013_team_list_is_only_the_managers_direct_reports | Integration | Passed | `backend/tests/integration/test_relationship_scoping.py` |
| AC-014 | test_ac014_pm_filtering_an_unassigned_project_is_refused_or_empty | Integration | Passed | `backend/tests/integration/test_relationship_scoping.py` |
| AC-014 | test_ac014_pm_sees_only_assigned_project_hours | Integration | Skipped | `backend/tests/integration/test_relationship_scoping.py` |
| AC-015 | test_ac015_employee_only_may_read_own_records | Integration | Passed | `backend/tests/integration/test_relationship_scoping.py` |
| AC-015 | test_ac015_employee_only_refused_403_for_non_own_record[attendance-/api/attendance] | Integration | Passed | `backend/tests/integration/test_relationship_scoping.py` |
| AC-015 | test_ac015_employee_only_refused_403_for_non_own_record[leave-/api/leave-requests] | Integration | Passed | `backend/tests/integration/test_relationship_scoping.py` |
| AC-015 | test_ac015_employee_only_refused_403_for_non_own_record[timesheet-/api/timesheets] | Integration | Passed | `backend/tests/integration/test_relationship_scoping.py` |
| AC-016 | test_ac016_hr_admin_reaches_every_employee | Integration | Passed | `backend/tests/integration/test_relationship_scoping.py` |
| AC-016 | test_ac016_hr_admin_refused_403_on_settings[get-/api/admin/settings-None] | Integration | Skipped | `backend/tests/integration/test_relationship_scoping.py` |
| AC-016 | test_ac016_hr_admin_refused_403_on_settings[patch-/api/admin/settings-body1] | Integration | Skipped | `backend/tests/integration/test_relationship_scoping.py` |
| AC-016 | test_ac016_hr_admin_refused_403_on_settings[put-/api/admin/settings-body2] | Integration | Skipped | `backend/tests/integration/test_relationship_scoping.py` |
| AC-016 | test_ac016_hr_admin_refused_403_on_user_management | Integration | Passed | `backend/tests/integration/test_relationship_scoping.py` |

### US-009: HR Admin maintains employee records

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-032 | Administration · Employees tab > [AC-032] creates a record and it appears in the directory from GET /api/employees | Unit | Passed | `frontend/src/screens/EmployeesTab.test.tsx` |
| AC-033 | Administration · Employees tab > [AC-033] flags each missing mandatory field inline and blocks submit | Unit | Passed | `frontend/src/screens/EmployeesTab.test.tsx` |
| AC-034 | Administration · Employees tab > [AC-034] changing reporting manager persists via PATCH and the directory reflects it | Unit | Passed | `frontend/src/screens/EmployeesTab.test.tsx` |
| AC-032 | test_ac032_create_persists_and_is_listed | Integration | Passed | `backend/tests/integration/test_employees.py` |
| AC-033 | test_ac033_missing_mandatory_field_is_422_naming_it[department_id] | Integration | Passed | `backend/tests/integration/test_employees.py` |
| AC-033 | test_ac033_missing_mandatory_field_is_422_naming_it[employee_number] | Integration | Passed | `backend/tests/integration/test_employees.py` |
| AC-033 | test_ac033_missing_mandatory_field_is_422_naming_it[full_name] | Integration | Passed | `backend/tests/integration/test_employees.py` |
| AC-033 | test_ac033_missing_mandatory_field_is_422_naming_it[reporting_manager_id] | Integration | Passed | `backend/tests/integration/test_employees.py` |
| AC-033 | test_ac033_missing_mandatory_field_is_422_naming_it[start_date] | Integration | Passed | `backend/tests/integration/test_employees.py` |
| AC-033 | test_ac033_missing_mandatory_field_is_422_naming_it[work_email] | Integration | Passed | `backend/tests/integration/test_employees.py` |
| AC-034 | test_ac034_manager_change_moves_employee_between_team_lists | Integration | Passed | `backend/tests/integration/test_employees.py` |
| AC-035 | test_ac035_edit_records_field_old_new_actor_timestamp | Integration | Passed | `backend/tests/integration/test_employees.py` |
| AC-035 | test_ac035_unchanged_edit_records_nothing | Integration | Passed | `backend/tests/integration/test_employees.py` |
| — | test_authz_non_hr_admin_cannot_create_employee | Integration | Passed | `backend/tests/integration/test_employees.py` |
| — | test_authz_unauthenticated_create_is_401 | Integration | Passed | `backend/tests/integration/test_employees.py` |
| — | [US-009-3] missing mandatory field shows inline validation, then create succeeds and appears in the directory | E2E | Not run yet | `frontend/e2e/employee-create.spec.ts` |

## Project setup

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | test_health_reports_ok | Unit | Passed | `backend/tests/test_health.py` |
| — | test_the_openapi_document_builds | Unit | Passed | `backend/tests/test_health.py` |
| — | the app loads | E2E | Not run yet | `frontend/e2e/example.spec.ts` |
<!-- sdlc:auto:end tests -->
