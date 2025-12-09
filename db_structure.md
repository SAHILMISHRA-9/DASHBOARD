| table_name           | column_name         | data_type                   |
| -------------------- | ------------------- | --------------------------- |
| anm_workers          | id                  | uuid                        |
| anm_workers          | user_id             | uuid                        |
| anm_workers          | created_at          | timestamp without time zone |
| asha_workers         | id                  | uuid                        |
| asha_workers         | user_id             | uuid                        |
| asha_workers         | created_at          | timestamp without time zone |
| doctor_workers       | id                  | uuid                        |
| doctor_workers       | user_id             | uuid                        |
| doctor_workers       | specialization      | text                        |
| doctor_workers       | license_number      | text                        |
| doctor_workers       | created_at          | timestamp without time zone |
| events_log           | id                  | uuid                        |
| events_log           | actor_id            | uuid                        |
| events_log           | event_type          | text                        |
| events_log           | metadata            | jsonb                       |
| events_log           | created_at          | timestamp without time zone |
| families             | id                  | uuid                        |
| families             | phc_id              | uuid                        |
| families             | area_id             | uuid                        |
| families             | asha_worker_id      | uuid                        |
| families             | anm_worker_id       | uuid                        |
| families             | head_member_id      | uuid                        |
| families             | address_line        | text                        |
| families             | landmark            | text                        |
| families             | device_created_at   | timestamp without time zone |
| families             | device_updated_at   | timestamp without time zone |
| families             | synced_at           | timestamp without time zone |
| families             | created_at          | timestamp without time zone |
| families             | updated_at          | timestamp without time zone |
| family_members       | id                  | uuid                        |
| family_members       | family_id           | uuid                        |
| family_members       | name                | text                        |
| family_members       | gender              | text                        |
| family_members       | age                 | integer                     |
| family_members       | relation            | text                        |
| family_members       | adhar_number        | text                        |
| family_members       | phone               | text                        |
| family_members       | is_alive            | boolean                     |
| family_members       | device_created_at   | timestamp without time zone |
| family_members       | device_updated_at   | timestamp without time zone |
| family_members       | synced_at           | timestamp without time zone |
| family_members       | created_at          | timestamp without time zone |
| family_members       | updated_at          | timestamp without time zone |
| family_members       | dob                 | date                        |
| health_records       | id                  | uuid                        |
| health_records       | phc_id              | uuid                        |
| health_records       | member_id           | uuid                        |
| health_records       | asha_worker_id      | uuid                        |
| health_records       | anm_worker_id       | uuid                        |
| health_records       | area_id             | uuid                        |
| health_records       | task_id             | uuid                        |
| health_records       | visit_type          | text                        |
| health_records       | data_json           | jsonb                       |
| health_records       | device_created_at   | timestamp without time zone |
| health_records       | device_updated_at   | timestamp without time zone |
| health_records       | synced_at           | timestamp without time zone |
| health_records       | created_at          | timestamp without time zone |
| health_records       | updated_at          | timestamp without time zone |
| health_records       | device_id           | text                        |
| health_records       | status              | text                        |
| phc_areas            | id                  | uuid                        |
| phc_areas            | phc_id              | uuid                        |
| phc_areas            | area_name           | text                        |
| phc_areas            | created_at          | timestamp without time zone |
| phc_areas            | updated_at          | timestamp without time zone |
| phcs                 | id                  | uuid                        |
| phcs                 | name                | text                        |
| phcs                 | address             | text                        |
| phcs                 | created_at          | timestamp without time zone |
| phcs                 | updated_at          | timestamp without time zone |
| phcs                 | pincode             | text                        |
| phcs                 | license_number      | text                        |
| sync_logs            | id                  | uuid                        |
| sync_logs            | user_id             | uuid                        |
| sync_logs            | action              | text                        |
| sync_logs            | payload             | jsonb                       |
| sync_logs            | status              | text                        |
| sync_logs            | created_at          | timestamp without time zone |
| tasks                | id                  | uuid                        |
| tasks                | phc_id              | uuid                        |
| tasks                | created_by          | uuid                        |
| tasks                | assigned_by_anm_id  | uuid                        |
| tasks                | assigned_to_asha_id | uuid                        |
| tasks                | area_id             | uuid                        |
| tasks                | family_id           | uuid                        |
| tasks                | member_id           | uuid                        |
| tasks                | parent_task_id      | uuid                        |
| tasks                | task_type           | text                        |
| tasks                | title               | text                        |
| tasks                | description         | text                        |
| tasks                | due_date            | date                        |
| tasks                | status              | text                        |
| tasks                | data_json           | jsonb                       |
| tasks                | device_created_at   | timestamp without time zone |
| tasks                | device_updated_at   | timestamp without time zone |
| tasks                | synced_at           | timestamp without time zone |
| tasks                | created_at          | timestamp without time zone |
| tasks                | updated_at          | timestamp without time zone |
| user_area_map        | id                  | uuid                        |
| user_area_map        | user_id             | uuid                        |
| user_area_map        | area_id             | uuid                        |
| user_area_map        | assigned_at         | timestamp without time zone |
| user_supervision_map | id                  | uuid                        |
| user_supervision_map | anm_worker_id       | uuid                        |
| user_supervision_map | asha_worker_id      | uuid                        |
| user_supervision_map | created_at          | timestamp without time zone |
| users                | id                  | uuid                        |
| users                | name                | text                        |
| users                | phone               | text                        |
| users                | role                | text                        |
| users                | phc_id              | uuid                        |
| users                | password_hash       | text                        |
| users                | created_at          | timestamp without time zone |
| users                | updated_at          | timestamp without time zone |
| users                | status              | text                        |
| users                | created_by          | uuid                        |
| users                | approved_by         | uuid                        |
| users                | gender              | text                        |
| users                | dob                 | date                        |
| users                | education_level     | text                        |
| vaccination_schedule | id                  | integer                     |
| vaccination_schedule | vaccine             | text                        |
| vaccination_schedule | dose_number         | integer                     |
| vaccination_schedule | min_age_days        | integer                     |
| vaccination_schedule | max_age_days        | integer                     |
| vaccination_schedule | description         | text                        |

