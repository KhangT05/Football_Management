import { fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { VenueController } from './../controllers/venue.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../controllers/user.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UploadController } from './../controllers/upload.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TournamentRuleController } from './../controllers/tournamentrule.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TournamentController } from './../controllers/tournament.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TeamController } from './../controllers/team.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SeasonController } from './../controllers/season.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RoleController } from './../controllers/role.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../controllers/auth.controller.js';
import { expressAuthentication } from './../middleware/auth.middleware.js';
// @ts-ignore - no great way to install types from subpackage
import { iocContainer } from './../libs/ioc.js';
import multer from 'multer';
const expressAuthenticationRecasted = expressAuthentication;
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "DefaultSelection__36_VenuePayload_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "deleted_at": { "dataType": "datetime", "required": true }, "updated_at": { "dataType": "datetime", "required": true }, "created_at": { "dataType": "datetime", "required": true }, "is_active": { "dataType": "boolean", "required": true }, "address": { "dataType": "string", "required": true }, "id": { "dataType": "double", "required": true }, "name": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VenueModel": {
        "dataType": "refAlias",
        "type": { "ref": "DefaultSelection__36_VenuePayload_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Venue": {
        "dataType": "refAlias",
        "type": { "ref": "VenueModel", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginationMeta": {
        "dataType": "refObject",
        "properties": {
            "total": { "dataType": "double", "required": true },
            "page": { "dataType": "double", "required": true },
            "per_page": { "dataType": "double", "required": true },
            "last_page": { "dataType": "double", "required": true },
            "has_next": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResult_Venue_": {
        "dataType": "refObject",
        "properties": {
            "data": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "Venue" }, "required": true },
            "meta": { "ref": "PaginationMeta", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofcreateVenueSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "address": { "dataType": "string", "required": true }, "name": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateVenueDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofcreateVenueSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofupdateVenueSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "is_active": { "dataType": "boolean" }, "address": { "dataType": "string" }, "name": { "dataType": "string" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateVenueDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofupdateVenueSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_User.Exclude_keyofUser.password__": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "name": { "dataType": "string", "required": true }, "id": { "dataType": "double", "required": true }, "is_active": { "dataType": "boolean", "required": true }, "created_at": { "dataType": "datetime", "required": true }, "updated_at": { "dataType": "datetime", "required": true }, "email": { "dataType": "string", "required": true }, "phone": { "dataType": "string", "required": true }, "email_verified": { "dataType": "boolean", "required": true }, "email_verified_at": { "dataType": "datetime", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_User.password_": {
        "dataType": "refAlias",
        "type": { "ref": "Pick_User.Exclude_keyofUser.password__", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SafeUser": {
        "dataType": "refAlias",
        "type": { "ref": "Omit_User.password_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResult_SafeUser_": {
        "dataType": "refObject",
        "properties": {
            "data": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "SafeUser" }, "required": true },
            "meta": { "ref": "PaginationMeta", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofcreateUserSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "phone": { "dataType": "string", "required": true }, "password": { "dataType": "string", "required": true }, "email": { "dataType": "string", "required": true }, "name": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateUserDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofcreateUserSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofupdateUserSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "role_ids": { "dataType": "array", "array": { "dataType": "double" } }, "phone": { "dataType": "string" }, "name": { "dataType": "string" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateUserDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofupdateUserSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SingleUploadResult": {
        "dataType": "refObject",
        "properties": {
            "url": { "dataType": "string", "required": true },
            "publicId": { "dataType": "string", "required": true },
            "format": { "dataType": "string", "required": true },
            "bytes": { "dataType": "double", "required": true },
            "width": { "dataType": "double" },
            "height": { "dataType": "double" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MultiUploadResult": {
        "dataType": "refObject",
        "properties": {
            "files": { "dataType": "array", "array": { "dataType": "intersection", "subSchemas": [{ "ref": "SingleUploadResult" }, { "dataType": "nestedObjectLiteral", "nestedProperties": { "originalName": { "dataType": "string", "required": true } } }] }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TiebreakerOption": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["goal_diff"] }, { "dataType": "enum", "enums": ["goals_scored"] }, { "dataType": "enum", "enums": ["head_to_head"] }, { "dataType": "enum", "enums": ["goals_conceded"] }, { "dataType": "enum", "enums": ["yellow_cards"] }, { "dataType": "enum", "enums": ["red_cards"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TournamentRuleDto": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double", "required": true },
            "tournament_id": { "dataType": "double", "required": true },
            "is_active": { "dataType": "boolean", "required": true },
            "points_per_win": { "dataType": "double", "required": true },
            "points_per_draw": { "dataType": "double", "required": true },
            "points_per_loss": { "dataType": "double", "required": true },
            "forfeit_score": { "dataType": "double", "required": true },
            "yellow_cards_suspension": { "dataType": "double", "required": true },
            "max_players_per_team": { "dataType": "double", "required": true },
            "min_players_per_team": { "dataType": "double", "required": true },
            "teams_advance_per_group": { "dataType": "double", "required": true },
            "tiebreaker_order": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "TiebreakerOption" }, "required": true },
            "created_at": { "dataType": "datetime", "required": true },
            "updated_at": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "user": { "dataType": "union", "subSchemas": [{ "dataType": "nestedObjectLiteral", "nestedProperties": { "phone": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }], "required": true }, "email": { "dataType": "string", "required": true }, "name": { "dataType": "string", "required": true }, "id": { "dataType": "double", "required": true } } }, { "dataType": "enum", "enums": [null] }] },
            "tournament": { "dataType": "union", "subSchemas": [{ "dataType": "nestedObjectLiteral", "nestedProperties": { "name": { "dataType": "string", "required": true }, "id": { "dataType": "double", "required": true } } }, { "dataType": "enum", "enums": [null] }] },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofcreateTournamentRuleSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "tiebreaker_order": { "dataType": "array", "array": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["goal_diff"] }, { "dataType": "enum", "enums": ["goals_scored"] }, { "dataType": "enum", "enums": ["head_to_head"] }, { "dataType": "enum", "enums": ["goals_conceded"] }, { "dataType": "enum", "enums": ["yellow_cards"] }, { "dataType": "enum", "enums": ["red_cards"] }] }, "required": true }, "teams_advance_per_group": { "dataType": "double", "required": true }, "min_players_per_team": { "dataType": "double", "required": true }, "max_players_per_team": { "dataType": "double", "required": true }, "yellow_cards_suspension": { "dataType": "double", "required": true }, "forfeit_score": { "dataType": "double", "required": true }, "points_per_loss": { "dataType": "double", "required": true }, "points_per_draw": { "dataType": "double", "required": true }, "points_per_win": { "dataType": "double", "required": true }, "tournament_id": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateTournamentRuleDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofcreateTournamentRuleSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofupdateTournamentRuleSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "tiebreaker_order": { "dataType": "array", "array": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["goal_diff"] }, { "dataType": "enum", "enums": ["goals_scored"] }, { "dataType": "enum", "enums": ["head_to_head"] }, { "dataType": "enum", "enums": ["goals_conceded"] }, { "dataType": "enum", "enums": ["yellow_cards"] }, { "dataType": "enum", "enums": ["red_cards"] }] } }, "teams_advance_per_group": { "dataType": "double" }, "min_players_per_team": { "dataType": "double" }, "max_players_per_team": { "dataType": "double" }, "yellow_cards_suspension": { "dataType": "double" }, "forfeit_score": { "dataType": "double" }, "points_per_loss": { "dataType": "double" }, "points_per_draw": { "dataType": "double" }, "points_per_win": { "dataType": "double" }, "tournament_id": { "dataType": "double" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateTournamentRuleDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofupdateTournamentRuleSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DefaultSelection__36_TournamentPayload_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "user_id": { "dataType": "double", "required": true }, "logo": { "dataType": "string", "required": true }, "description": { "dataType": "string", "required": true }, "deleted_at": { "dataType": "datetime", "required": true }, "updated_at": { "dataType": "datetime", "required": true }, "created_at": { "dataType": "datetime", "required": true }, "is_active": { "dataType": "boolean", "required": true }, "id": { "dataType": "double", "required": true }, "name": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TournamentModel": {
        "dataType": "refAlias",
        "type": { "ref": "DefaultSelection__36_TournamentPayload_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Tournament": {
        "dataType": "refAlias",
        "type": { "ref": "TournamentModel", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResult_Tournament_": {
        "dataType": "refObject",
        "properties": {
            "data": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "Tournament" }, "required": true },
            "meta": { "ref": "PaginationMeta", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofupdateTournamentSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "is_active": { "dataType": "boolean" }, "logo": { "dataType": "string" }, "description": { "dataType": "string" }, "name": { "dataType": "string" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateTournamentDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofupdateTournamentSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DefaultSelection__36_TeamPayload_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "coach_name": { "dataType": "string", "required": true }, "user_id": { "dataType": "double", "required": true }, "logo": { "dataType": "string", "required": true }, "description": { "dataType": "string", "required": true }, "deleted_at": { "dataType": "datetime", "required": true }, "updated_at": { "dataType": "datetime", "required": true }, "created_at": { "dataType": "datetime", "required": true }, "is_active": { "dataType": "boolean", "required": true }, "id": { "dataType": "double", "required": true }, "name": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TeamModel": {
        "dataType": "refAlias",
        "type": { "ref": "DefaultSelection__36_TeamPayload_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Team": {
        "dataType": "refAlias",
        "type": { "ref": "TeamModel", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResult_Team_": {
        "dataType": "refObject",
        "properties": {
            "data": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "Team" }, "required": true },
            "meta": { "ref": "PaginationMeta", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DefaultSelection__36_TeamLeaderPayload_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "team_id": { "dataType": "double", "required": true }, "user_id": { "dataType": "double", "required": true }, "deleted_at": { "dataType": "datetime", "required": true }, "updated_at": { "dataType": "datetime", "required": true }, "created_at": { "dataType": "datetime", "required": true }, "is_active": { "dataType": "boolean", "required": true }, "id": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TeamLeaderModel": {
        "dataType": "refAlias",
        "type": { "ref": "DefaultSelection__36_TeamLeaderPayload_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TeamLeader": {
        "dataType": "refAlias",
        "type": { "ref": "TeamLeaderModel", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SeasonStatus": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["upcoming"] }, { "dataType": "enum", "enums": ["registration_open"] }, { "dataType": "enum", "enums": ["ongoing"] }, { "dataType": "enum", "enums": ["finished"] }, { "dataType": "enum", "enums": ["cancelled"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Decimal": {
        "dataType": "refAlias",
        "type": { "dataType": "string", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DefaultSelection__36_SeasonPayload_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "registration_fee": { "ref": "Decimal", "required": true }, "is_registration_open": { "dataType": "boolean", "required": true }, "max_teams": { "dataType": "double", "required": true }, "registration_deadline": { "dataType": "datetime", "required": true }, "end_date": { "dataType": "datetime", "required": true }, "start_date": { "dataType": "datetime", "required": true }, "status": { "ref": "SeasonStatus", "required": true }, "user_id": { "dataType": "double", "required": true }, "description": { "dataType": "string", "required": true }, "tournament_id": { "dataType": "double", "required": true }, "deleted_at": { "dataType": "datetime", "required": true }, "updated_at": { "dataType": "datetime", "required": true }, "created_at": { "dataType": "datetime", "required": true }, "is_active": { "dataType": "boolean", "required": true }, "id": { "dataType": "double", "required": true }, "name": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SeasonModel": {
        "dataType": "refAlias",
        "type": { "ref": "DefaultSelection__36_SeasonPayload_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Season": {
        "dataType": "refAlias",
        "type": { "ref": "SeasonModel", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResult_Season_": {
        "dataType": "refObject",
        "properties": {
            "data": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "Season" }, "required": true },
            "meta": { "ref": "PaginationMeta", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofcreateSeasonSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "registration_deadline": { "dataType": "datetime" }, "end_date": { "dataType": "datetime" }, "start_date": { "dataType": "datetime" }, "description": { "dataType": "string" }, "tournament_id": { "dataType": "double", "required": true }, "is_active": { "dataType": "boolean", "required": true }, "is_registration_open": { "dataType": "boolean", "required": true }, "max_teams": { "dataType": "double", "required": true }, "status": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["upcoming"] }, { "dataType": "enum", "enums": ["registration_open"] }, { "dataType": "enum", "enums": ["ongoing"] }, { "dataType": "enum", "enums": ["finished"] }, { "dataType": "enum", "enums": ["cancelled"] }], "required": true }, "name": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateSeasonDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofcreateSeasonSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofupdateSeasonSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "is_registration_open": { "dataType": "boolean" }, "max_teams": { "dataType": "double" }, "registration_deadline": { "dataType": "datetime" }, "end_date": { "dataType": "datetime" }, "start_date": { "dataType": "datetime" }, "status": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["upcoming"] }, { "dataType": "enum", "enums": ["registration_open"] }, { "dataType": "enum", "enums": ["ongoing"] }, { "dataType": "enum", "enums": ["finished"] }, { "dataType": "enum", "enums": ["cancelled"] }] }, "description": { "dataType": "string" }, "is_active": { "dataType": "boolean" }, "name": { "dataType": "string" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateSeasonDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofupdateSeasonSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofUpdateSeasonStatusSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "cancel_reason": { "dataType": "string" }, "status": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["upcoming"] }, { "dataType": "enum", "enums": ["registration_open"] }, { "dataType": "enum", "enums": ["ongoing"] }, { "dataType": "enum", "enums": ["finished"] }, { "dataType": "enum", "enums": ["cancelled"] }], "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateSeasonStatusDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofUpdateSeasonStatusSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DefaultSelection__36_RolePayload_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "description": { "dataType": "string", "required": true }, "updated_at": { "dataType": "datetime", "required": true }, "created_at": { "dataType": "datetime", "required": true }, "is_active": { "dataType": "boolean", "required": true }, "id": { "dataType": "double", "required": true }, "name": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoleModel": {
        "dataType": "refAlias",
        "type": { "ref": "DefaultSelection__36_RolePayload_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Role": {
        "dataType": "refAlias",
        "type": { "ref": "RoleModel", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResult_Role_": {
        "dataType": "refObject",
        "properties": {
            "data": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "Role" }, "required": true },
            "meta": { "ref": "PaginationMeta", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofcreateRoleSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "description": { "dataType": "string" }, "name": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateRoleDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofcreateRoleSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofupdateRoleSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "is_active": { "dataType": "boolean" }, "description": { "dataType": "string" }, "name": { "dataType": "string" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateRoleDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofupdateRoleSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TokenResponseDto": {
        "dataType": "refObject",
        "properties": {
            "accessToken": { "dataType": "string", "required": true },
            "tokenType": { "dataType": "enum", "enums": ["Bearer"], "required": true },
            "expiresIn": { "dataType": "double", "required": true },
            "csrfToken": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseShape_TokenResponseDto_": {
        "dataType": "refObject",
        "properties": {
            "status": { "dataType": "boolean", "required": true },
            "message": { "dataType": "string", "required": true },
            "data": { "dataType": "union", "subSchemas": [{ "ref": "TokenResponseDto" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "timestamp": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofLoginSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "email": { "dataType": "string", "required": true }, "password": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofLoginSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofRegisterSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "name": { "dataType": "string", "required": true }, "email": { "dataType": "string", "required": true }, "password": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RegisterDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofRegisterSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserPayload": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double", "required": true },
            "name": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiResponseShape_UserPayload_": {
        "dataType": "refObject",
        "properties": {
            "status": { "dataType": "boolean", "required": true },
            "message": { "dataType": "string", "required": true },
            "data": { "dataType": "union", "subSchemas": [{ "ref": "UserPayload" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "timestamp": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, { "noImplicitAdditionalProperties": "throw-on-extras", "bodyCoercion": true });
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
export function RegisterRoutes(app, opts) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    const upload = opts?.multer || multer({ "limits": { "fileSize": 8388608 } });
    const argsVenueController_findAll = {
        page: { "default": 1, "in": "query", "name": "page", "dataType": "double" },
        per_page: { "default": 20, "in": "query", "name": "per_page", "dataType": "double" },
        q: { "in": "query", "name": "q", "dataType": "string" },
        sort: { "in": "query", "name": "sort", "dataType": "string" },
        direction: { "in": "query", "name": "direction", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["asc"] }, { "dataType": "enum", "enums": ["desc"] }] },
    };
    app.get('/venues', authenticateMiddleware([{ "jwt": ["user", "admin"] }]), ...(fetchMiddlewares(VenueController)), ...(fetchMiddlewares(VenueController.prototype.findAll)), async function VenueController_findAll(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsVenueController_findAll, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(VenueController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'findAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsVenueController_findById = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/venues/:id', authenticateMiddleware([{ "jwt": ["user", "admin"] }]), ...(fetchMiddlewares(VenueController)), ...(fetchMiddlewares(VenueController.prototype.findById)), async function VenueController_findById(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsVenueController_findById, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(VenueController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'findById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsVenueController_create = {
        body: { "in": "body", "name": "body", "required": true, "ref": "CreateVenueDto" },
    };
    app.post('/venues', authenticateMiddleware([{ "jwt": ["user", "admin"] }]), ...(fetchMiddlewares(VenueController)), ...(fetchMiddlewares(VenueController.prototype.create)), async function VenueController_create(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsVenueController_create, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(VenueController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsVenueController_update = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "UpdateVenueDto" },
    };
    app.patch('/venues/:id', authenticateMiddleware([{ "jwt": ["user", "admin"] }]), ...(fetchMiddlewares(VenueController)), ...(fetchMiddlewares(VenueController.prototype.update)), async function VenueController_update(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsVenueController_update, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(VenueController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsVenueController_softDelete = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.delete('/venues/:id', authenticateMiddleware([{ "jwt": ["user", "admin"] }]), ...(fetchMiddlewares(VenueController)), ...(fetchMiddlewares(VenueController.prototype.softDelete)), async function VenueController_softDelete(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsVenueController_softDelete, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(VenueController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'softDelete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_findAll = {
        page: { "default": 1, "in": "query", "name": "page", "dataType": "double" },
        per_page: { "default": 20, "in": "query", "name": "per_page", "dataType": "double" },
        q: { "in": "query", "name": "q", "dataType": "string" },
        sort: { "in": "query", "name": "sort", "dataType": "string" },
        direction: { "in": "query", "name": "direction", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["asc"] }, { "dataType": "enum", "enums": ["desc"] }] },
    };
    app.get('/users', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(UserController)), ...(fetchMiddlewares(UserController.prototype.findAll)), async function UserController_findAll(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_findAll, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(UserController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'findAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_findById = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/users/:id', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(UserController)), ...(fetchMiddlewares(UserController.prototype.findById)), async function UserController_findById(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_findById, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(UserController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'findById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_create = {
        body: { "in": "body", "name": "body", "required": true, "ref": "CreateUserDto" },
    };
    app.post('/users', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(UserController)), ...(fetchMiddlewares(UserController.prototype.create)), async function UserController_create(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_create, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(UserController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_update = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "UpdateUserDto" },
    };
    app.patch('/users/:id', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(UserController)), ...(fetchMiddlewares(UserController.prototype.update)), async function UserController_update(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_update, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(UserController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_softDelete = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.delete('/users/:id', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(UserController)), ...(fetchMiddlewares(UserController.prototype.softDelete)), async function UserController_softDelete(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_softDelete, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(UserController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'softDelete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUploadController_uploadSingle = {
        namespace: { "in": "formData", "name": "namespace", "required": true, "dataType": "string" },
        kind: { "in": "formData", "name": "kind", "required": true, "dataType": "string" },
        file: { "in": "formData", "name": "file", "required": true, "dataType": "file" },
        _req: { "in": "request", "name": "_req", "required": true, "dataType": "object" },
    };
    app.post('/upload/single', authenticateMiddleware([{ "jwt": [] }]), upload.fields([
        {
            name: "file",
            maxCount: 1
        }
    ]), ...(fetchMiddlewares(UploadController)), ...(fetchMiddlewares(UploadController.prototype.uploadSingle)), async function UploadController_uploadSingle(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUploadController_uploadSingle, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(UploadController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'uploadSingle',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUploadController_uploadMulti = {
        namespace: { "in": "formData", "name": "namespace", "required": true, "dataType": "string" },
        kind: { "in": "formData", "name": "kind", "required": true, "dataType": "string" },
        files: { "in": "formData", "name": "files", "required": true, "dataType": "array", "array": { "dataType": "file" } },
        _req: { "in": "request", "name": "_req", "required": true, "dataType": "object" },
    };
    app.post('/upload/multi', authenticateMiddleware([{ "jwt": [] }]), upload.fields([
        {
            name: "files",
        }
    ]), ...(fetchMiddlewares(UploadController)), ...(fetchMiddlewares(UploadController.prototype.uploadMulti)), async function UploadController_uploadMulti(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUploadController_uploadMulti, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(UploadController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'uploadMulti',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTournamentRuleController_findAll = {};
    app.get('/tournamentrules', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(TournamentRuleController)), ...(fetchMiddlewares(TournamentRuleController.prototype.findAll)), async function TournamentRuleController_findAll(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsTournamentRuleController_findAll, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(TournamentRuleController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'findAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTournamentRuleController_findById = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/tournamentrules/:id', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(TournamentRuleController)), ...(fetchMiddlewares(TournamentRuleController.prototype.findById)), async function TournamentRuleController_findById(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsTournamentRuleController_findById, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(TournamentRuleController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'findById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTournamentRuleController_create = {
        body: { "in": "body", "name": "body", "required": true, "ref": "CreateTournamentRuleDto" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/tournamentrules', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(TournamentRuleController)), ...(fetchMiddlewares(TournamentRuleController.prototype.create)), async function TournamentRuleController_create(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsTournamentRuleController_create, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(TournamentRuleController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTournamentRuleController_update = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "UpdateTournamentRuleDto" },
    };
    app.patch('/tournamentrules/:id', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(TournamentRuleController)), ...(fetchMiddlewares(TournamentRuleController.prototype.update)), async function TournamentRuleController_update(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsTournamentRuleController_update, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(TournamentRuleController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTournamentRuleController_softDelete = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.delete('/tournamentrules/:id', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(TournamentRuleController)), ...(fetchMiddlewares(TournamentRuleController.prototype.softDelete)), async function TournamentRuleController_softDelete(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsTournamentRuleController_softDelete, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(TournamentRuleController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'softDelete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTournamentController_findAll = {
        page: { "default": 1, "in": "query", "name": "page", "dataType": "double" },
        per_page: { "default": 20, "in": "query", "name": "per_page", "dataType": "double" },
        q: { "in": "query", "name": "q", "dataType": "string" },
        sort: { "in": "query", "name": "sort", "dataType": "string" },
        direction: { "in": "query", "name": "direction", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["asc"] }, { "dataType": "enum", "enums": ["desc"] }] },
    };
    app.get('/tournaments', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(TournamentController)), ...(fetchMiddlewares(TournamentController.prototype.findAll)), async function TournamentController_findAll(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_findAll, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(TournamentController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'findAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTournamentController_findById = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/tournaments/:id', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(TournamentController)), ...(fetchMiddlewares(TournamentController.prototype.findById)), async function TournamentController_findById(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_findById, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(TournamentController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'findById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTournamentController_create = {
        name: { "in": "formData", "name": "name", "required": true, "dataType": "string" },
        description: { "in": "formData", "name": "description", "required": true, "dataType": "string" },
        logo: { "in": "formData", "name": "logo", "required": true, "dataType": "file" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/tournaments', authenticateMiddleware([{ "jwt": [] }]), upload.fields([
        {
            name: "logo",
            maxCount: 1
        }
    ]), ...(fetchMiddlewares(TournamentController)), ...(fetchMiddlewares(TournamentController.prototype.create)), async function TournamentController_create(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_create, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(TournamentController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTournamentController_update = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "UpdateTournamentDto" },
    };
    app.patch('/tournaments/:id', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(TournamentController)), ...(fetchMiddlewares(TournamentController.prototype.update)), async function TournamentController_update(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_update, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(TournamentController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTournamentController_softDelete = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.delete('/tournaments/:id', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(TournamentController)), ...(fetchMiddlewares(TournamentController.prototype.softDelete)), async function TournamentController_softDelete(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsTournamentController_softDelete, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(TournamentController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'softDelete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTeamController_findAll = {
        page: { "default": 1, "in": "query", "name": "page", "dataType": "double" },
        per_page: { "default": 20, "in": "query", "name": "per_page", "dataType": "double" },
        q: { "in": "query", "name": "q", "dataType": "string" },
        sort: { "in": "query", "name": "sort", "dataType": "string" },
        direction: { "in": "query", "name": "direction", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["asc"] }, { "dataType": "enum", "enums": ["desc"] }] },
    };
    app.get('/teams', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(TeamController)), ...(fetchMiddlewares(TeamController.prototype.findAll)), async function TeamController_findAll(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsTeamController_findAll, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(TeamController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'findAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTeamController_findById = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/teams/:id', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(TeamController)), ...(fetchMiddlewares(TeamController.prototype.findById)), async function TeamController_findById(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsTeamController_findById, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(TeamController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'findById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTeamController_create = {
        name: { "in": "formData", "name": "name", "required": true, "dataType": "string" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        coach_name: { "in": "formData", "name": "coach_name", "dataType": "string" },
        description: { "in": "formData", "name": "description", "dataType": "string" },
        logo: { "in": "formData", "name": "logo", "dataType": "file" },
    };
    app.post('/teams', authenticateMiddleware([{ "jwt": [] }]), upload.fields([
        {
            name: "logo",
            maxCount: 1
        }
    ]), ...(fetchMiddlewares(TeamController)), ...(fetchMiddlewares(TeamController.prototype.create)), async function TeamController_create(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsTeamController_create, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(TeamController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTeamController_update = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        name: { "in": "formData", "name": "name", "dataType": "string" },
        coach_name: { "in": "formData", "name": "coach_name", "dataType": "string" },
        description: { "in": "formData", "name": "description", "dataType": "string" },
        logoFile: { "in": "formData", "name": "logo", "dataType": "file" },
    };
    app.patch('/teams/:id', authenticateMiddleware([{ "jwt": [] }]), upload.fields([
        {
            name: "logo",
            maxCount: 1
        }
    ]), ...(fetchMiddlewares(TeamController)), ...(fetchMiddlewares(TeamController.prototype.update)), async function TeamController_update(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsTeamController_update, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(TeamController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTeamController_softDelete = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.delete('/teams/:id', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(TeamController)), ...(fetchMiddlewares(TeamController.prototype.softDelete)), async function TeamController_softDelete(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsTeamController_softDelete, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(TeamController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'softDelete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTeamController_getCaptain = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/teams/:id/captain', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(TeamController)), ...(fetchMiddlewares(TeamController.prototype.getCaptain)), async function TeamController_getCaptain(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsTeamController_getCaptain, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(TeamController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'getCaptain',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTeamController_assignCaptain = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "user_id": { "dataType": "double", "required": true } } },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/teams/:id/captain', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(TeamController)), ...(fetchMiddlewares(TeamController.prototype.assignCaptain)), async function TeamController_assignCaptain(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsTeamController_assignCaptain, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(TeamController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'assignCaptain',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsSeasonController_findAll = {
        page: { "default": 1, "in": "query", "name": "page", "dataType": "double" },
        per_page: { "default": 20, "in": "query", "name": "per_page", "dataType": "double" },
        q: { "in": "query", "name": "q", "dataType": "string" },
        sort: { "in": "query", "name": "sort", "dataType": "string" },
        direction: { "in": "query", "name": "direction", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["asc"] }, { "dataType": "enum", "enums": ["desc"] }] },
    };
    app.get('/seasons', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(SeasonController)), ...(fetchMiddlewares(SeasonController.prototype.findAll)), async function SeasonController_findAll(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSeasonController_findAll, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(SeasonController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'findAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsSeasonController_findById = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/seasons/:id', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(SeasonController)), ...(fetchMiddlewares(SeasonController.prototype.findById)), async function SeasonController_findById(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSeasonController_findById, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(SeasonController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'findById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsSeasonController_create = {
        body: { "in": "body", "name": "body", "required": true, "ref": "CreateSeasonDto" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/seasons', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(SeasonController)), ...(fetchMiddlewares(SeasonController.prototype.create)), async function SeasonController_create(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSeasonController_create, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(SeasonController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsSeasonController_update = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "UpdateSeasonDto" },
    };
    app.patch('/seasons/:id', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(SeasonController)), ...(fetchMiddlewares(SeasonController.prototype.update)), async function SeasonController_update(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSeasonController_update, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(SeasonController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsSeasonController_softDelete = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.delete('/seasons/:id', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(SeasonController)), ...(fetchMiddlewares(SeasonController.prototype.softDelete)), async function SeasonController_softDelete(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSeasonController_softDelete, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(SeasonController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'softDelete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsSeasonController_updateStatus = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "UpdateSeasonStatusDto" },
    };
    app.patch('/seasons/:id/status', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(SeasonController)), ...(fetchMiddlewares(SeasonController.prototype.updateStatus)), async function SeasonController_updateStatus(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSeasonController_updateStatus, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(SeasonController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'updateStatus',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRoleController_findAll = {
        page: { "default": 1, "in": "query", "name": "page", "dataType": "double" },
        per_page: { "default": 20, "in": "query", "name": "per_page", "dataType": "double" },
        q: { "in": "query", "name": "q", "dataType": "string" },
        sort: { "in": "query", "name": "sort", "dataType": "string" },
        direction: { "in": "query", "name": "direction", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["asc"] }, { "dataType": "enum", "enums": ["desc"] }] },
    };
    app.get('/roles', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(RoleController)), ...(fetchMiddlewares(RoleController.prototype.findAll)), async function RoleController_findAll(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsRoleController_findAll, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(RoleController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'findAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRoleController_findById = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/roles/:id', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(RoleController)), ...(fetchMiddlewares(RoleController.prototype.findById)), async function RoleController_findById(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsRoleController_findById, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(RoleController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'findById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRoleController_create = {
        body: { "in": "body", "name": "body", "required": true, "ref": "CreateRoleDto" },
    };
    app.post('/roles', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(RoleController)), ...(fetchMiddlewares(RoleController.prototype.create)), async function RoleController_create(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsRoleController_create, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(RoleController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRoleController_update = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "UpdateRoleDto" },
    };
    app.patch('/roles/:id', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(RoleController)), ...(fetchMiddlewares(RoleController.prototype.update)), async function RoleController_update(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsRoleController_update, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(RoleController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRoleController_softDelete = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.delete('/roles/:id', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(RoleController)), ...(fetchMiddlewares(RoleController.prototype.softDelete)), async function RoleController_softDelete(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsRoleController_softDelete, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(RoleController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'softDelete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAuthController_login = {
        body: { "in": "body", "name": "body", "required": true, "ref": "LoginDto" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/auth/login', ...(fetchMiddlewares(AuthController)), ...(fetchMiddlewares(AuthController.prototype.login)), async function AuthController_login(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_login, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(AuthController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAuthController_register = {
        body: { "in": "body", "name": "body", "required": true, "ref": "RegisterDto" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/auth/register', ...(fetchMiddlewares(AuthController)), ...(fetchMiddlewares(AuthController.prototype.register)), async function AuthController_register(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_register, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(AuthController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'register',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAuthController_refresh = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        csrfHeader: { "in": "header", "name": "x-csrf-token", "dataType": "string" },
    };
    app.post('/auth/refresh', ...(fetchMiddlewares(AuthController)), ...(fetchMiddlewares(AuthController.prototype.refresh)), async function AuthController_refresh(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_refresh, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(AuthController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'refresh',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAuthController_logout = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/auth/logout', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(AuthController)), ...(fetchMiddlewares(AuthController.prototype.logout)), async function AuthController_logout(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_logout, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(AuthController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'logout',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAuthController_me = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.get('/auth/me', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(AuthController)), ...(fetchMiddlewares(AuthController.prototype.me)), async function AuthController_me(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_me, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(AuthController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'me',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function authenticateMiddleware(security = []) {
        return async function runAuthenticationMiddleware(request, response, next) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts = [];
            const pushAndRethrow = (error) => {
                failedAttempts.push(error);
                throw error;
            };
            const secMethodOrPromises = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises = [];
                    for (const name in secMethod) {
                        secMethodAndPromises.push(expressAuthenticationRecasted(request, name, secMethod[name], response)
                            .catch(pushAndRethrow));
                    }
                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                }
                else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(expressAuthenticationRecasted(request, name, secMethod[name], response)
                            .catch(pushAndRethrow));
                    }
                }
            }
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            try {
                request['user'] = await Promise.any(secMethodOrPromises);
                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next();
            }
            catch (err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;
                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        };
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
//# sourceMappingURL=routes.js.map