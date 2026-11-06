# Tests

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start summary -->
226 tests · Passed 217 · Failed 2 · Skipped 7 · Not run 0

Acceptance criteria covered: 53/163 · passing: 46/163
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start tests -->
## Sprint 1

### US-001: Sign in with email and password

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-004 | App > [AC-004] redirects unauthenticated access to the sign-in screen | Unit | Passed | `frontend/src/App.test.tsx` |
| AC-017 | App > [AC-017] a 401 on any call ends the session and returns to sign-in | Unit | Passed | `frontend/src/App.test.tsx` |
| AC-020 | App > [AC-020] sign out calls logout, clears the token and returns to sign-in | Unit | Passed | `frontend/src/App.test.tsx` |
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
| AC-010 | [AC-010] multi-role user sees both the employee and the manager/admin menus | E2E | Passed | `frontend/e2e/navigation-gating.spec.ts` |
| AC-011 | [AC-011] Employee-only user sees neither Team & Approvals nor Administration menus | E2E | Failed | `frontend/e2e/navigation-gating.spec.ts` |

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
| AC-134 | [AC-134] no language selector on the sign-in screen | E2E | Passed | `frontend/e2e/single-language-timestamps.spec.ts` |
| AC-135 | [AC-135] [NFR-017] company-timezone formatting is independent of browser timezone | E2E | Passed | `frontend/e2e/single-language-timestamps.spec.ts` |
| AC-135 | [AC-135] the same instant renders identically across screens and in company timezone | E2E | Passed | `frontend/e2e/single-language-timestamps.spec.ts` |

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
| AC-006 | [AC-006] the sign-in screen itself exposes no self-registration affordance | E2E | Passed | `frontend/e2e/no-self-registration.spec.ts` |

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
| — | [US-009-3] missing mandatory field shows inline validation, then create succeeds and appears in the directory | E2E | Passed | `frontend/e2e/employee-create.spec.ts` |

## Sprint 3

### US-006: Administrator-issued password reset

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-021 | forced password change > [AC-021] sign-in tells users to contact an administrator, with no reset link | Unit | Passed | `frontend/src/screens/ChangePassword.test.tsx` |
| AC-023 | forced password change > [AC-023] changing the password calls the API and goes home | Unit | Passed | `frontend/src/screens/ChangePassword.test.tsx` |
| AC-023 | forced password change > [AC-023] mismatched confirmation blocks submit | Unit | Passed | `frontend/src/screens/ChangePassword.test.tsx` |
| AC-023 | forced password change > [AC-023] must_change_password login stores the token and routes to change-password | Unit | Passed | `frontend/src/screens/ChangePassword.test.tsx` |
| AC-023 | forced password change > [AC-023] other routes redirect to change-password while the flag is set | Unit | Passed | `frontend/src/screens/ChangePassword.test.tsx` |
| AC-021 | test_ac021_no_self_service_reset_route_exists | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| AC-022 | test_ac022_non_admin_gets_403_and_unknown_user_404 | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| AC-022 | test_ac022_reset_returns_one_time_password_and_replaces_hash | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| AC-022 | test_ac022_second_reset_invalidates_first_one_time_password | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| AC-023 | test_ac023_logout_allowed_while_change_required | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| AC-023 | test_ac023_must_change_blocks_other_routes_until_change | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| AC-023 | test_ac023_new_password_must_differ | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| AC-023 | test_ac023_normal_user_unaffected[/api/me] | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| AC-024 | test_ac024_non_admin_cannot_read_audit_of_reset | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| AC-024 | test_ac024_reset_and_change_are_audited_without_password | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| AC-024 | test_ac024_reset_audit_entry_has_actor_account_timestamp_and_no_otp | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| AC-021 | [AC-021] sign-in tells the user to contact an administrator and offers no self-service reset | E2E | Passed | `frontend/e2e/forced-password-change.spec.ts` |
| AC-023 | [AC-023] one-time password sign-in is forced to change password before any other screen | E2E | Passed | `frontend/e2e/forced-password-change.spec.ts` |

### US-008: View and update my own profile

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-029 | My Profile > [AC-029] shows my details | Unit | Passed | `frontend/src/screens/Profile.test.tsx` |
| AC-030 | My Profile > [AC-030] saves only the two editable fields and confirms | Unit | Passed | `frontend/src/screens/Profile.test.tsx` |
| AC-030 | My Profile > [AC-030] shows the API error on failure | Unit | Passed | `frontend/src/screens/Profile.test.tsx` |
| AC-031 | My Profile > [AC-031] identity fields are read-only | Unit | Passed | `frontend/src/screens/Profile.test.tsx` |
| AC-029 | test_ac029_other_employee_record_is_403 | Integration | Passed | `backend/tests/integration/test_own_profile.py` |
| AC-029 | test_ac029_own_profile_shows_identity_fields | Integration | Passed | `backend/tests/integration/test_own_profile.py` |
| AC-030 | test_ac030_personal_contact_editable | Integration | Passed | `backend/tests/integration/test_own_profile.py` |
| AC-030 | test_ac030_update_mobile_is_stored_and_audited | Integration | Passed | `backend/tests/integration/test_own_profile.py` |
| AC-031 | test_ac031_cannot_patch_another_employee | Integration | Passed | `backend/tests/integration/test_own_profile.py` |
| AC-031 | test_ac031_direct_patch_of_restricted_field_is_403_and_unsaved[department_id] | Integration | Passed | `backend/tests/integration/test_own_profile.py` |
| AC-031 | test_ac031_direct_patch_of_restricted_field_is_403_and_unsaved[employee_number] | Integration | Passed | `backend/tests/integration/test_own_profile.py` |
| AC-031 | test_ac031_direct_patch_of_restricted_field_is_403_and_unsaved[reporting_manager_id] | Integration | Passed | `backend/tests/integration/test_own_profile.py` |
| AC-031 | test_ac031_mixed_payload_is_refused_whole | Integration | Passed | `backend/tests/integration/test_own_profile.py` |
| AC-031 | test_ac031_refused_attempt_writes_no_audit | Integration | Passed | `backend/tests/integration/test_own_profile.py` |
| AC-031 | test_ac031_unauthenticated_patch_is_401 | Integration | Passed | `backend/tests/integration/test_own_profile.py` |
| AC-029 | [AC-029] My Profile displays name, employee ID, department, manager, work email and contact details | E2E | Passed | `frontend/e2e/my-profile.spec.ts` |
| AC-030 | [AC-030] changing the mobile number saves, sends only editable fields and confirms on screen | E2E | Passed | `frontend/e2e/my-profile.spec.ts` |
| AC-031 | [AC-031] department, reporting manager and employee ID are read-only | E2E | Passed | `frontend/e2e/my-profile.spec.ts` |

### US-010: HR Admin corrects or erases a leaver's record

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-036 | test_ac036_leaver_disappears_from_team_list | Integration | Passed | `backend/tests/integration/test_leaver_erasure.py` |
| AC-036 | test_ac036_leaver_marking_is_audited | Integration | Passed | `backend/tests/integration/test_leaver_erasure.py` |
| AC-036 | test_ac036_leaver_not_offered_in_assignment_picker | Integration | Skipped | `backend/tests/integration/test_leaver_erasure.py` |
| AC-036 | test_ac036_leaver_requires_end_date | Integration | Passed | `backend/tests/integration/test_leaver_erasure.py` |
| AC-036 | test_ac036_linked_portal_account_deactivated_and_session_dropped | Integration | Passed | `backend/tests/integration/test_leaver_erasure.py` |
| AC-037 | test_ac037_active_employee_cannot_be_erased | Integration | Passed | `backend/tests/integration/test_leaver_erasure.py` |
| AC-037 | test_ac037_audit_retains_who_and_when_without_pii | Integration | Passed | `backend/tests/integration/test_leaver_erasure.py` |
| AC-037 | test_ac037_erased_leaver_absent_from_team_list | Integration | Passed | `backend/tests/integration/test_leaver_erasure.py` |
| AC-037 | test_ac037_erasure_removes_identifying_fields_irreversibly | Integration | Passed | `backend/tests/integration/test_leaver_erasure.py` |
| AC-037 | test_ac037_unknown_employee_is_404 | Integration | Passed | `backend/tests/integration/test_leaver_erasure.py` |
| AC-038 | test_ac038_employee_cannot_mark_self_leaver | Integration | Passed | `backend/tests/integration/test_leaver_erasure.py` |
| AC-038 | test_ac038_non_hr_admin_cannot_erase[EMPLOYEE] | Integration | Passed | `backend/tests/integration/test_leaver_erasure.py` |
| AC-038 | test_ac038_non_hr_admin_cannot_erase[PROJECT_MANAGER] | Integration | Passed | `backend/tests/integration/test_leaver_erasure.py` |
| AC-038 | test_ac038_non_hr_admin_cannot_erase[REPORTING_MANAGER] | Integration | Passed | `backend/tests/integration/test_leaver_erasure.py` |
| AC-038 | test_ac038_non_hr_admin_cannot_erase[SYSTEM_ADMIN] | Integration | Passed | `backend/tests/integration/test_leaver_erasure.py` |
| AC-038 | test_ac038_non_hr_admin_cannot_mark_leaver[EMPLOYEE] | Integration | Passed | `backend/tests/integration/test_leaver_erasure.py` |
| AC-038 | test_ac038_non_hr_admin_cannot_mark_leaver[PROJECT_MANAGER] | Integration | Passed | `backend/tests/integration/test_leaver_erasure.py` |
| AC-038 | test_ac038_non_hr_admin_cannot_mark_leaver[REPORTING_MANAGER] | Integration | Passed | `backend/tests/integration/test_leaver_erasure.py` |
| AC-038 | test_ac038_non_hr_admin_cannot_mark_leaver[SYSTEM_ADMIN] | Integration | Passed | `backend/tests/integration/test_leaver_erasure.py` |
| AC-038 | test_ac038_refused_attempts_write_no_audit | Integration | Passed | `backend/tests/integration/test_leaver_erasure.py` |
| AC-038 | test_ac038_unauthenticated_is_401 | Integration | Passed | `backend/tests/integration/test_leaver_erasure.py` |

### US-012: Manager views their direct reports

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-042 | My Team > [AC-042] lists exactly the returned reports with department and statuses | Unit | Passed | `frontend/src/screens/MyTeam.test.tsx` |
| AC-042 | My Team > [AC-042] shows an error state | Unit | Passed | `frontend/src/screens/MyTeam.test.tsx` |
| AC-042 | My Team > [AC-042] shows the empty state | Unit | Passed | `frontend/src/screens/MyTeam.test.tsx` |
| AC-043 | My Team > [AC-043] renders no links, so no profile outside the list is reachable | Unit | Passed | `frontend/src/screens/MyTeam.test.tsx` |
| AC-042 | test_ac042_each_member_carries_department | Integration | Passed | `backend/tests/integration/test_my_team.py` |
| AC-042 | test_ac042_each_member_carries_leave_and_timesheet_status | Integration | Passed | `backend/tests/integration/test_my_team.py` |
| AC-042 | test_ac042_employee_without_employee_record_gets_empty_team | Integration | Passed | `backend/tests/integration/test_my_team.py` |
| AC-042 | test_ac042_exactly_the_three_reports_are_listed | Integration | Passed | `backend/tests/integration/test_my_team.py` |
| AC-043 | test_ac043_direct_report_profile_is_reachable | Integration | Passed | `backend/tests/integration/test_my_team.py` |
| AC-043 | test_ac043_employee_only_user_cannot_read_a_colleague | Integration | Passed | `backend/tests/integration/test_my_team.py` |
| AC-043 | test_ac043_non_report_is_not_listed | Integration | Passed | `backend/tests/integration/test_my_team.py` |
| AC-043 | test_ac043_non_report_profile_is_refused_403_without_data[malformed] | Integration | Passed | `backend/tests/integration/test_my_team.py` |
| AC-043 | test_ac043_non_report_profile_is_refused_403_without_data[outsider] | Integration | Passed | `backend/tests/integration/test_my_team.py` |
| AC-043 | test_ac043_non_report_profile_is_refused_403_without_data[unassigned] | Integration | Passed | `backend/tests/integration/test_my_team.py` |
| AC-043 | test_ac043_non_report_profile_is_refused_403_without_data[unknown] | Integration | Passed | `backend/tests/integration/test_my_team.py` |
| AC-043 | test_ac043_unauthenticated_is_401 | Integration | Passed | `backend/tests/integration/test_my_team.py` |
| AC-042 | [AC-042] My Team lists exactly the three reports with department and leave/timesheet status | E2E | Passed | `frontend/e2e/my-team.spec.ts` |
| AC-042 | [AC-042] a manager with no reports sees the empty state | E2E | Passed | `frontend/e2e/my-team.spec.ts` |
| AC-043 | [AC-043] a non-report is not listed on My Team | E2E | Passed | `frontend/e2e/my-team.spec.ts` |
| AC-043 | [AC-043] a non-report's profile is not reachable from the screen | E2E | Passed | `frontend/e2e/my-team.spec.ts` |

## Sprint 4

### US-016: Log daily hours against assigned projects

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-052 | Timesheet grid > [AC-052] saves 7.5 via PUT, keeps it under today and shows Draft | Unit | Passed | `frontend/src/screens/Timesheet.test.tsx` |
| AC-053 | Timesheet grid > [AC-053] only pickable projects are editable; closed ones are read-only | Unit | Passed | `frontend/src/screens/Timesheet.test.tsx` |
| AC-053 | Timesheet grid > [AC-053] shows the empty state when there are no projects | Unit | Passed | `frontend/src/screens/Timesheet.test.tsx` |
| AC-054 | Timesheet grid > [AC-054] a 422 daily maximum shows the server message, flags the day, keeps values | Unit | Passed | `frontend/src/screens/Timesheet.test.tsx` |
| AC-055 | Timesheet grid > [AC-055] a negative value is flagged client-side and nothing is sent | Unit | Passed | `frontend/src/screens/Timesheet.test.tsx` |
| AC-056 | Timesheet grid > [AC-056] loads the current week and shows row, day and week totals | Unit | Passed | `frontend/src/screens/Timesheet.test.tsx` |
| AC-058 | Timesheet grid > [AC-058] next week loads that week; locked weeks are read-only | Unit | Passed | `frontend/src/screens/Timesheet.test.tsx` |
| AC-046 | test_ac046_closed_project_hours_returned_on_locked_week[approved] | Integration | Passed | `backend/tests/integration/test_timesheet_week.py` |
| AC-046 | test_ac046_closed_project_hours_returned_on_locked_week[submitted] | Integration | Passed | `backend/tests/integration/test_timesheet_week.py` |
| AC-046 | test_ac046_closing_project_unpicks_it_but_keeps_hours | Integration | Passed | `backend/tests/integration/test_timesheet_week.py` |
| AC-052 | test_ac052_put_stores_in_draft_and_get_returns_it | Integration | Passed | `backend/tests/integration/test_timesheet_week.py` |
| AC-053 | test_ac053_pickable_only_for_active_assigned_projects | Integration | Passed | `backend/tests/integration/test_timesheet_week.py` |
| AC-053 | test_ac053_unassignment_removes_pickable_but_keeps_hours | Integration | Passed | `backend/tests/integration/test_timesheet_week.py` |
| AC-054 | test_ac054_exactly_24_is_accepted | Integration | Passed | `backend/tests/integration/test_timesheet_week.py` |
| AC-054 | test_ac054_over_24_is_422_naming_daily_maximum_and_nothing_saved | Integration | Passed | `backend/tests/integration/test_timesheet_week.py` |
| AC-054 | test_ac054_single_cell_over_24_is_422 | Integration | Passed | `backend/tests/integration/test_timesheet_week.py` |
| AC-055 | test_ac055_bad_row_blocks_whole_payload | Integration | Passed | `backend/tests/integration/test_timesheet_week.py` |
| AC-055 | test_ac055_negative_or_non_numeric_hours_422_with_field_and_not_saved[-0.5] | Integration | Passed | `backend/tests/integration/test_timesheet_week.py` |
| AC-055 | test_ac055_negative_or_non_numeric_hours_422_with_field_and_not_saved[-1] | Integration | Passed | `backend/tests/integration/test_timesheet_week.py` |
| AC-055 | test_ac055_negative_or_non_numeric_hours_422_with_field_and_not_saved[None] | Integration | Passed | `backend/tests/integration/test_timesheet_week.py` |
| AC-055 | test_ac055_negative_or_non_numeric_hours_422_with_field_and_not_saved[] | Integration | Passed | `backend/tests/integration/test_timesheet_week.py` |
| AC-055 | test_ac055_negative_or_non_numeric_hours_422_with_field_and_not_saved[abc] | Integration | Passed | `backend/tests/integration/test_timesheet_week.py` |
| — | test_nfr004_employee_reads_only_own_week | Integration | Passed | `backend/tests/integration/test_timesheet_week.py` |
| — | test_nfr004_other_employee_cannot_write_into_my_week | Integration | Passed | `backend/tests/integration/test_timesheet_week.py` |
| — | test_nfr004_put_unassigned_project_is_403_and_not_saved | Integration | Passed | `backend/tests/integration/test_timesheet_week.py` |
| — | test_nfr004_unauthenticated_is_401 | Integration | Passed | `backend/tests/integration/test_timesheet_week.py` |
| AC-054 | [AC-054] a day total above 24 is flagged inline with a message and is not saved | E2E | Failed | `frontend/e2e/timesheet-grid.spec.ts` |
| AC-055 | [AC-055] a negative value is flagged inline with a message and is not saved | E2E | Passed | `frontend/e2e/timesheet-grid.spec.ts` |
| AC-056 | [AC-056] grid shows each assigned project as a row, Mon–Sun columns and row/day/week totals | E2E | Passed | `frontend/e2e/timesheet-grid.spec.ts` |
| AC-057 | [AC-057] editing a cell and clicking Save draft recalculates totals and persists after reload | E2E | Passed | `frontend/e2e/timesheet-grid.spec.ts` |
| AC-058 | [AC-058] Previous and Next week show that week's entries and status; an empty week is a blank draft | E2E | Passed | `frontend/e2e/timesheet-grid.spec.ts` |

## Project setup

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | test_health_reports_ok | Unit | Passed | `backend/tests/test_health.py` |
| — | test_the_openapi_document_builds | Unit | Passed | `backend/tests/test_health.py` |
| — | the app loads | E2E | Passed | `frontend/e2e/example.spec.ts` |
<!-- sdlc:auto:end tests -->
