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
import { SeasonTeamController } from './../controllers/seasonteam.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SeasonController } from './../controllers/season.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ScheduleController } from './../controllers/schedule.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RoleController } from './../controllers/role.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PlayerController } from './../controllers/player.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MatchResultController } from './../controllers/matchResult.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MatchController } from './../controllers/match.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { KnockoutController } from './../controllers/knockout.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GroupController } from './../controllers/group.controller.js';
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
    "SeasonTeamStatus": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["approved"] }, { "dataType": "enum", "enums": ["pending"] }, { "dataType": "enum", "enums": ["active"] }, { "dataType": "enum", "enums": ["eliminated"] }, { "dataType": "enum", "enums": ["withdrawn"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DefaultSelection__36_SeasonTeamPayload_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "group_id": { "dataType": "double", "required": true }, "seed": { "dataType": "double", "required": true }, "status": { "ref": "SeasonTeamStatus", "required": true }, "season_id": { "dataType": "double", "required": true }, "team_id": { "dataType": "double", "required": true }, "user_id": { "dataType": "double", "required": true }, "deleted_at": { "dataType": "datetime", "required": true }, "updated_at": { "dataType": "datetime", "required": true }, "created_at": { "dataType": "datetime", "required": true }, "is_active": { "dataType": "boolean", "required": true }, "id": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SeasonTeamModel": {
        "dataType": "refAlias",
        "type": { "ref": "DefaultSelection__36_SeasonTeamPayload_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SeasonTeam": {
        "dataType": "refAlias",
        "type": { "ref": "SeasonTeamModel", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResult_SeasonTeam_": {
        "dataType": "refObject",
        "properties": {
            "data": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "SeasonTeam" }, "required": true },
            "meta": { "ref": "PaginationMeta", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SeasonTeamWithRelations": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double", "required": true },
            "season_id": { "dataType": "double", "required": true },
            "team_id": { "dataType": "double", "required": true },
            "user_id": { "dataType": "union", "subSchemas": [{ "dataType": "double" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "status": { "ref": "SeasonTeamStatus", "required": true },
            "group_id": { "dataType": "union", "subSchemas": [{ "dataType": "double" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "created_at": { "dataType": "datetime", "required": true },
            "updated_at": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "deleted_at": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "is_active": { "dataType": "boolean", "required": true },
            "seed": { "dataType": "union", "subSchemas": [{ "dataType": "double" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "season": { "dataType": "nestedObjectLiteral", "nestedProperties": { "name": { "dataType": "string", "required": true }, "id": { "dataType": "double", "required": true } }, "required": true },
            "team": { "dataType": "nestedObjectLiteral", "nestedProperties": { "logo": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }], "required": true }, "name": { "dataType": "string", "required": true }, "id": { "dataType": "double", "required": true } }, "required": true },
            "user": { "dataType": "union", "subSchemas": [{ "dataType": "nestedObjectLiteral", "nestedProperties": { "email": { "dataType": "string", "required": true }, "name": { "dataType": "string", "required": true }, "id": { "dataType": "double", "required": true } } }, { "dataType": "enum", "enums": [null] }], "required": true },
            "group": { "dataType": "union", "subSchemas": [{ "dataType": "nestedObjectLiteral", "nestedProperties": { "name": { "dataType": "string", "required": true }, "id": { "dataType": "double", "required": true } } }, { "dataType": "enum", "enums": [null] }], "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofselfRegisterSeasonTeamSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "season_id": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SelfRegisterSeasonTeamDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofselfRegisterSeasonTeamSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofadminAddSeasonTeamSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "status": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["approved"] }, { "dataType": "enum", "enums": ["pending"] }, { "dataType": "enum", "enums": ["active"] }, { "dataType": "enum", "enums": ["eliminated"] }, { "dataType": "enum", "enums": ["withdrawn"] }], "required": true }, "team_id": { "dataType": "double", "required": true }, "season_id": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminAddSeasonTeamDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofadminAddSeasonTeamSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofupdateSeasonTeamStatusSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "status": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["approved"] }, { "dataType": "enum", "enums": ["pending"] }, { "dataType": "enum", "enums": ["active"] }, { "dataType": "enum", "enums": ["eliminated"] }, { "dataType": "enum", "enums": ["withdrawn"] }], "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateSeasonTeamStatusDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofupdateSeasonTeamStatusSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofassignGroupSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "group_id": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AssignGroupDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofassignGroupSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SeasonStatus": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["upcoming"] }, { "dataType": "enum", "enums": ["registration_open"] }, { "dataType": "enum", "enums": ["ongoing"] }, { "dataType": "enum", "enums": ["finished"] }, { "dataType": "enum", "enums": ["cancelled"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SeasonListItem": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "_count": { "dataType": "nestedObjectLiteral", "nestedProperties": { "phases": { "dataType": "double", "required": true } }, "required": true }, "tournament": { "dataType": "nestedObjectLiteral", "nestedProperties": { "name": { "dataType": "string", "required": true }, "id": { "dataType": "double", "required": true } }, "required": true }, "end_date": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "enum", "enums": [null] }], "required": true }, "start_date": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "enum", "enums": [null] }], "required": true }, "status": { "ref": "SeasonStatus", "required": true }, "name": { "dataType": "string", "required": true }, "id": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResult_SeasonListItem_": {
        "dataType": "refObject",
        "properties": {
            "data": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "SeasonListItem" }, "required": true },
            "meta": { "ref": "PaginationMeta", "required": true },
        },
        "additionalProperties": false,
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
    "PaginatedResult__id-number--team_id-number--group_id-number--position-number--matches_played-number--wins-number--draws-number--losses-number--goals_for-number--goals_against-number--points-number__": {
        "dataType": "refObject",
        "properties": {
            "data": { "dataType": "array", "array": { "dataType": "nestedObjectLiteral", "nestedProperties": { "points": { "dataType": "double", "required": true }, "goals_against": { "dataType": "double", "required": true }, "goals_for": { "dataType": "double", "required": true }, "losses": { "dataType": "double", "required": true }, "draws": { "dataType": "double", "required": true }, "wins": { "dataType": "double", "required": true }, "matches_played": { "dataType": "double", "required": true }, "position": { "dataType": "double", "required": true }, "group_id": { "dataType": "double", "required": true }, "team_id": { "dataType": "double", "required": true }, "id": { "dataType": "double", "required": true } } }, "required": true },
            "meta": { "ref": "PaginationMeta", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResult__id-number--goals_scored-number--yellow_cards-number--red_cards-number--team_id-number--season_id-number--matches_played-number--player_id-number--accumulated_yellow_cards-number--is_suspended-boolean__": {
        "dataType": "refObject",
        "properties": {
            "data": { "dataType": "array", "array": { "dataType": "nestedObjectLiteral", "nestedProperties": { "is_suspended": { "dataType": "boolean", "required": true }, "accumulated_yellow_cards": { "dataType": "double", "required": true }, "player_id": { "dataType": "double", "required": true }, "matches_played": { "dataType": "double", "required": true }, "season_id": { "dataType": "double", "required": true }, "team_id": { "dataType": "double", "required": true }, "red_cards": { "dataType": "double", "required": true }, "yellow_cards": { "dataType": "double", "required": true }, "goals_scored": { "dataType": "double", "required": true }, "id": { "dataType": "double", "required": true } } }, "required": true },
            "meta": { "ref": "PaginationMeta", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GenerateResult": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "warnings": { "dataType": "array", "array": { "dataType": "string" }, "required": true }, "failedMatchIds": { "dataType": "array", "array": { "dataType": "double" }, "required": true }, "matchesScheduled": { "dataType": "double", "required": true }, "groupIds": { "dataType": "array", "array": { "dataType": "double" }, "required": true }, "groupCount": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofgenerateScheduleSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "minRestDaysPerTeam": { "dataType": "double" }, "doubleRound": { "dataType": "boolean", "required": true }, "matchTimes": { "dataType": "array", "array": { "dataType": "string" }, "required": true }, "venueIds": { "dataType": "array", "array": { "dataType": "double" }, "required": true }, "maxGroupSize": { "dataType": "double", "required": true }, "minGroupSize": { "dataType": "double", "required": true }, "desiredGroupCount": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GenerateScheduleDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofgenerateScheduleSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofautoScheduleSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "matchTimes": { "dataType": "array", "array": { "dataType": "string" }, "required": true }, "venueIds": { "dataType": "array", "array": { "dataType": "double" }, "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AutoScheduleDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofautoScheduleSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofrescheduleMatchSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "scheduledAt": { "dataType": "datetime" }, "venueId": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RescheduleMatchDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofrescheduleMatchSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MatchStatus": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["ongoing"] }, { "dataType": "enum", "enums": ["finished"] }, { "dataType": "enum", "enums": ["cancelled"] }, { "dataType": "enum", "enums": ["scheduled"] }, { "dataType": "enum", "enums": ["forfeited"] }, { "dataType": "enum", "enums": ["postponed"] }, { "dataType": "enum", "enums": ["bye"] }, { "dataType": "enum", "enums": ["abandoned"] }, { "dataType": "enum", "enums": ["pending_official"] }, { "dataType": "enum", "enums": ["needs_review"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MatchPeriod": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["first_half"] }, { "dataType": "enum", "enums": ["second_half"] }, { "dataType": "enum", "enums": ["extra_time_first"] }, { "dataType": "enum", "enums": ["extra_time_second"] }, { "dataType": "enum", "enums": ["penalty_shootout"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MatchResultType": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["full_time"] }, { "dataType": "enum", "enums": ["extra_time"] }, { "dataType": "enum", "enums": ["penalty"] }, { "dataType": "enum", "enums": ["forfeit"] }, { "dataType": "enum", "enums": ["walkover"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DefaultSelection__36_MatchPayload_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "referee": { "dataType": "string", "required": true }, "is_published": { "dataType": "boolean", "required": true }, "venue_id": { "dataType": "double", "required": true }, "manual_away_score": { "dataType": "double", "required": true }, "manual_home_score": { "dataType": "double", "required": true }, "finalize_away_penalty": { "dataType": "double", "required": true }, "finalize_home_penalty": { "dataType": "double", "required": true }, "finalize_away_half_time": { "dataType": "double", "required": true }, "finalize_home_half_time": { "dataType": "double", "required": true }, "finalize_result_type": { "ref": "MatchResultType", "required": true }, "pending_official_at": { "dataType": "datetime", "required": true }, "abandoned_minute": { "dataType": "double", "required": true }, "replay_of_match_id": { "dataType": "double", "required": true }, "postponed_reason": { "dataType": "string", "required": true }, "postponed_from": { "dataType": "datetime", "required": true }, "current_period": { "ref": "MatchPeriod", "required": true }, "leg": { "dataType": "double", "required": true }, "round": { "dataType": "string", "required": true }, "away_score": { "dataType": "double", "required": true }, "home_score": { "dataType": "double", "required": true }, "played_at": { "dataType": "datetime", "required": true }, "scheduled_at": { "dataType": "datetime", "required": true }, "away_team_id": { "dataType": "double", "required": true }, "home_team_id": { "dataType": "double", "required": true }, "phase_id": { "dataType": "double", "required": true }, "group_id": { "dataType": "double", "required": true }, "status": { "ref": "MatchStatus", "required": true }, "user_id": { "dataType": "double", "required": true }, "deleted_at": { "dataType": "datetime", "required": true }, "updated_at": { "dataType": "datetime", "required": true }, "created_at": { "dataType": "datetime", "required": true }, "is_active": { "dataType": "boolean", "required": true }, "id": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MatchModel": {
        "dataType": "refAlias",
        "type": { "ref": "DefaultSelection__36_MatchPayload_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Match": {
        "dataType": "refAlias",
        "type": { "ref": "MatchModel", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResult_Match_": {
        "dataType": "refObject",
        "properties": {
            "data": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "Match" }, "required": true },
            "meta": { "ref": "PaginationMeta", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Match.id-or-round-or-home_team_id-or-away_team_id-or-scheduled_at-or-venue_id-or-status_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "id": { "dataType": "double", "required": true }, "status": { "ref": "MatchStatus", "required": true }, "home_team_id": { "dataType": "double", "required": true }, "away_team_id": { "dataType": "double", "required": true }, "scheduled_at": { "dataType": "datetime", "required": true }, "round": { "dataType": "string", "required": true }, "venue_id": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MatchByTeamRow": {
        "dataType": "refAlias",
        "type": { "ref": "Pick_Match.id-or-round-or-home_team_id-or-away_team_id-or-scheduled_at-or-venue_id-or-status_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResult_MatchByTeamRow_": {
        "dataType": "refObject",
        "properties": {
            "data": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "MatchByTeamRow" }, "required": true },
            "meta": { "ref": "PaginationMeta", "required": true },
        },
        "additionalProperties": false,
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
    "PlayerPosition": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["goalkeeper"] }, { "dataType": "enum", "enums": ["defender"] }, { "dataType": "enum", "enums": ["midfielder"] }, { "dataType": "enum", "enums": ["forward"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PlayerDto": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double", "required": true },
            "date_of_birth": { "dataType": "datetime", "required": true },
            "position": { "ref": "PlayerPosition", "required": true },
            "height": { "dataType": "union", "subSchemas": [{ "dataType": "double" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "weight": { "dataType": "union", "subSchemas": [{ "dataType": "double" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "nationality": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "avatar": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "is_active": { "dataType": "boolean", "required": true },
            "created_at": { "dataType": "datetime", "required": true },
            "updated_at": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "user": { "dataType": "union", "subSchemas": [{ "dataType": "nestedObjectLiteral", "nestedProperties": { "phone": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }], "required": true }, "email": { "dataType": "string", "required": true }, "name": { "dataType": "string", "required": true }, "id": { "dataType": "double", "required": true } } }, { "dataType": "enum", "enums": [null] }] },
            "user_id": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofcreatePlayerSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "avatar": { "dataType": "string" }, "nationality": { "dataType": "string" }, "weight": { "dataType": "double" }, "height": { "dataType": "double" }, "position": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["goalkeeper"] }, { "dataType": "enum", "enums": ["defender"] }, { "dataType": "enum", "enums": ["midfielder"] }, { "dataType": "enum", "enums": ["forward"] }], "required": true }, "date_of_birth": { "dataType": "datetime", "required": true }, "user_id": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreatePlayerDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofcreatePlayerSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofupdatePlayerSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "avatar": { "dataType": "string" }, "nationality": { "dataType": "string" }, "weight": { "dataType": "double" }, "height": { "dataType": "double" }, "date_of_birth": { "dataType": "datetime" }, "position": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["goalkeeper"] }, { "dataType": "enum", "enums": ["defender"] }, { "dataType": "enum", "enums": ["midfielder"] }, { "dataType": "enum", "enums": ["forward"] }] } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdatePlayerDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofupdatePlayerSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PlayerRole": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["player"] }, { "dataType": "enum", "enums": ["captain"] }, { "dataType": "enum", "enums": ["vice_captain"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PlayerStatus": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["active"] }, { "dataType": "enum", "enums": ["injured"] }, { "dataType": "enum", "enums": ["suspended"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApprovalStatus": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["approved"] }, { "dataType": "enum", "enums": ["pending"] }, { "dataType": "enum", "enums": ["rejected"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TeamPlayerDto": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "double", "required": true },
            "team_id": { "dataType": "double", "required": true },
            "player_id": { "dataType": "double", "required": true },
            "jersey_number": { "dataType": "double", "required": true },
            "position": { "ref": "PlayerPosition", "required": true },
            "role": { "ref": "PlayerRole", "required": true },
            "status": { "ref": "PlayerStatus", "required": true },
            "approval_status": { "ref": "ApprovalStatus", "required": true },
            "is_active": { "dataType": "boolean", "required": true },
            "created_at": { "dataType": "datetime", "required": true },
            "updated_at": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "player": { "dataType": "union", "subSchemas": [{ "ref": "PlayerDto" }, { "dataType": "enum", "enums": [null] }] },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResult_TeamPlayerDto_": {
        "dataType": "refObject",
        "properties": {
            "data": { "dataType": "array", "array": { "dataType": "refObject", "ref": "TeamPlayerDto" }, "required": true },
            "meta": { "ref": "PaginationMeta", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofaddPlayerToTeamSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "role": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["player"] }, { "dataType": "enum", "enums": ["captain"] }, { "dataType": "enum", "enums": ["vice_captain"] }], "required": true }, "position": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["goalkeeper"] }, { "dataType": "enum", "enums": ["defender"] }, { "dataType": "enum", "enums": ["midfielder"] }, { "dataType": "enum", "enums": ["forward"] }], "required": true }, "jersey_number": { "dataType": "double", "required": true }, "player_id": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AddPlayerToTeamDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofaddPlayerToTeamSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofupdateTeamPlayerSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "is_active": { "dataType": "boolean" }, "approval_status": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["approved"] }, { "dataType": "enum", "enums": ["pending"] }, { "dataType": "enum", "enums": ["rejected"] }] }, "status": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["active"] }, { "dataType": "enum", "enums": ["injured"] }, { "dataType": "enum", "enums": ["suspended"] }] }, "role": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["player"] }, { "dataType": "enum", "enums": ["captain"] }, { "dataType": "enum", "enums": ["vice_captain"] }] }, "position": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["goalkeeper"] }, { "dataType": "enum", "enums": ["defender"] }, { "dataType": "enum", "enums": ["midfielder"] }, { "dataType": "enum", "enums": ["forward"] }] }, "jersey_number": { "dataType": "double" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateTeamPlayerDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofupdateTeamPlayerSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofbulkDeleteSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "ids": { "dataType": "array", "array": { "dataType": "double" }, "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BulkDeleteDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofbulkDeleteSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MatchResultStatus": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["official"] }, { "dataType": "enum", "enums": ["protested"] }, { "dataType": "enum", "enums": ["overturned"] }, { "dataType": "enum", "enums": ["under_review"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MatchEventType": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["goal"] }, { "dataType": "enum", "enums": ["own_goal"] }, { "dataType": "enum", "enums": ["yellow_card"] }, { "dataType": "enum", "enums": ["red_card"] }, { "dataType": "enum", "enums": ["second_yellow"] }, { "dataType": "enum", "enums": ["substitution_in"] }, { "dataType": "enum", "enums": ["substitution_out"] }, { "dataType": "enum", "enums": ["penalty_scored"] }, { "dataType": "enum", "enums": ["penalty_missed"] }, { "dataType": "enum", "enums": ["card_rescinded"] }, { "dataType": "enum", "enums": ["goal_disallowed"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResult__id-number--created_at-Date--type-MatchEventType--team_id-number--player_id-number--match_id-number--minute-number--period-MatchPeriod--added_minute-number__": {
        "dataType": "refObject",
        "properties": {
            "data": { "dataType": "array", "array": { "dataType": "nestedObjectLiteral", "nestedProperties": { "added_minute": { "dataType": "double", "required": true }, "period": { "ref": "MatchPeriod", "required": true }, "minute": { "dataType": "double", "required": true }, "match_id": { "dataType": "double", "required": true }, "player_id": { "dataType": "double", "required": true }, "team_id": { "dataType": "double", "required": true }, "type": { "ref": "MatchEventType", "required": true }, "created_at": { "dataType": "datetime", "required": true }, "id": { "dataType": "double", "required": true } } }, "required": true },
            "meta": { "ref": "PaginationMeta", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Prisma__Pick_MatchEventGroupByOutputType.MaybeTupleToUnion__40_type-or-team_id-or-player_id_41_-Array__": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": {}, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PickEnumerable_MatchEventGroupByOutputType._40_type-or-team_id-or-player_id_41_-Array_": {
        "dataType": "refAlias",
        "type": { "ref": "Prisma__Pick_MatchEventGroupByOutputType.MaybeTupleToUnion__40_type-or-team_id-or-player_id_41_-Array__", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ConfirmResultOutput": {
        "dataType": "refObject",
        "properties": {
            "matchResultId": { "dataType": "double", "required": true },
            "winnerTeamId": { "dataType": "union", "subSchemas": [{ "dataType": "double" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "standingUpdated": { "dataType": "boolean", "required": true },
            "knockoutAdvanced": { "dataType": "boolean", "required": true },
            "newMatchId": { "dataType": "double" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ConfirmResultInput": {
        "dataType": "refObject",
        "properties": {
            "homeScore": { "dataType": "double", "required": true },
            "awayScore": { "dataType": "double", "required": true },
            "resultType": { "ref": "MatchResultType", "required": true },
            "homeHalfTimeScore": { "dataType": "double" },
            "awayHalfTimeScore": { "dataType": "double" },
            "homeExtraTime": { "dataType": "double" },
            "awayExtraTime": { "dataType": "double" },
            "homePenalty": { "dataType": "double" },
            "awayPenalty": { "dataType": "double" },
            "notes": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_GenerateOptions.venueIds-or-matchTimes_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "venueIds": { "dataType": "array", "array": { "dataType": "double" }, "required": true }, "matchTimes": { "dataType": "array", "array": { "dataType": "string" }, "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ScheduleOptions": {
        "dataType": "refAlias",
        "type": { "ref": "Pick_GenerateOptions.venueIds-or-matchTimes_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ConfirmOfficialBody": {
        "dataType": "refObject",
        "properties": {
            "input": { "ref": "ConfirmResultInput", "required": true },
            "scheduleOptions": { "ref": "ScheduleOptions", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofTransitionPeriodSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "period": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["first_half"] }, { "dataType": "enum", "enums": ["second_half"] }, { "dataType": "enum", "enums": ["extra_time_first"] }, { "dataType": "enum", "enums": ["extra_time_second"] }, { "dataType": "enum", "enums": ["penalty_shootout"] }], "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransitionPeriodDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofTransitionPeriodSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RecordEventInput": {
        "dataType": "refObject",
        "properties": {
            "playerId": { "dataType": "double" },
            "teamId": { "dataType": "double" },
            "type": { "ref": "MatchEventType", "required": true },
            "minute": { "dataType": "double" },
            "addedMinute": { "dataType": "double" },
            "period": { "ref": "MatchPeriod" },
            "note": { "dataType": "string" },
            "subOutPlayerId": { "dataType": "double" },
            "wasOwnGoal": { "dataType": "boolean" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofFinalizeMatchSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "awayPenaltyScore": { "dataType": "double" }, "homePenaltyScore": { "dataType": "double" }, "awayHalfTimeScore": { "dataType": "double" }, "homeHalfTimeScore": { "dataType": "double" }, "resultType": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["full_time"] }, { "dataType": "enum", "enums": ["extra_time"] }, { "dataType": "enum", "enums": ["penalty"] }, { "dataType": "enum", "enums": ["forfeit"] }, { "dataType": "enum", "enums": ["walkover"] }], "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FinalizeMatchDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofFinalizeMatchSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofManualScoreSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "awayPenalty": { "dataType": "double" }, "homePenalty": { "dataType": "double" }, "resultType": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["full_time"] }, { "dataType": "enum", "enums": ["extra_time"] }, { "dataType": "enum", "enums": ["penalty"] }, { "dataType": "enum", "enums": ["forfeit"] }, { "dataType": "enum", "enums": ["walkover"] }], "required": true }, "awayScore": { "dataType": "double", "required": true }, "homeScore": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ManualScoreDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofManualScoreSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofConfirmOfficialSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "matchTimes": { "dataType": "array", "array": { "dataType": "string" } }, "venueIds": { "dataType": "array", "array": { "dataType": "double" } } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ConfirmOfficialDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofConfirmOfficialSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofForfeitMatchSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "matchTimes": { "dataType": "array", "array": { "dataType": "string" } }, "venueIds": { "dataType": "array", "array": { "dataType": "double" } }, "forfeitingTeamId": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ForfeitMatchDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofForfeitMatchSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofAbandonMatchSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "reason": { "dataType": "string" }, "minute": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AbandonMatchDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofAbandonMatchSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofFileDisputeSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "reason": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FileDisputeDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofFileDisputeSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofResolveAppealSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "newAwayScore": { "dataType": "double" }, "newHomeScore": { "dataType": "double" }, "note": { "dataType": "string", "required": true }, "resolution": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["uphold"] }, { "dataType": "enum", "enums": ["overturn"] }], "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResolveAppealDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofResolveAppealSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_RecordEventInput.Exclude_keyofRecordEventInput.period__": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "type": { "ref": "MatchEventType", "required": true }, "minute": { "dataType": "double" }, "note": { "dataType": "string" }, "playerId": { "dataType": "double" }, "teamId": { "dataType": "double" }, "addedMinute": { "dataType": "double" }, "subOutPlayerId": { "dataType": "double" }, "wasOwnGoal": { "dataType": "boolean" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AddEventInput": {
        "dataType": "refObject",
        "properties": {
            "type": { "ref": "MatchEventType", "required": true },
            "minute": { "dataType": "double" },
            "note": { "dataType": "string" },
            "playerId": { "dataType": "double" },
            "teamId": { "dataType": "double" },
            "addedMinute": { "dataType": "double" },
            "subOutPlayerId": { "dataType": "double" },
            "wasOwnGoal": { "dataType": "boolean" },
            "period": { "ref": "MatchPeriod", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_RecordEventInput_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "playerId": { "dataType": "double" }, "teamId": { "dataType": "double" }, "type": { "ref": "MatchEventType" }, "minute": { "dataType": "double" }, "addedMinute": { "dataType": "double" }, "period": { "ref": "MatchPeriod" }, "note": { "dataType": "string" }, "subOutPlayerId": { "dataType": "double" }, "wasOwnGoal": { "dataType": "boolean" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EditEventInput": {
        "dataType": "refAlias",
        "type": { "ref": "Partial_RecordEventInput_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EditScoreInput": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "notes": { "dataType": "string" }, "resultType": { "ref": "MatchResultType" }, "awayHalfTime": { "dataType": "double" }, "homeHalfTime": { "dataType": "double" }, "awayExtraTime": { "dataType": "double" }, "homeExtraTime": { "dataType": "double" }, "awayPenalty": { "dataType": "double" }, "homePenalty": { "dataType": "double" }, "awayScore": { "dataType": "double", "required": true }, "homeScore": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "KnockoutGenerateResult": {
        "dataType": "refObject",
        "properties": {
            "totalSlots": { "dataType": "double", "required": true },
            "round1Matches": { "dataType": "double", "required": true },
            "byeSlots": { "dataType": "double", "required": true },
            "warnings": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofgenerateKnockoutRequestSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "legs": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": [1] }, { "dataType": "enum", "enums": [2] }] }, "seededTeamIds": { "dataType": "array", "array": { "dataType": "double" }, "required": true }, "matchTimes": { "dataType": "array", "array": { "dataType": "string" }, "required": true }, "venueIds": { "dataType": "array", "array": { "dataType": "double" }, "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GenerateKnockoutRequestDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofgenerateKnockoutRequestSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "infer_typeofadvanceWinnerRequestSchema_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "matchTimes": { "dataType": "array", "array": { "dataType": "string" }, "required": true }, "venueIds": { "dataType": "array", "array": { "dataType": "double" }, "required": true }, "winnerTeamId": { "dataType": "double", "required": true }, "matchId": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdvanceWinnerRequestDto": {
        "dataType": "refAlias",
        "type": { "ref": "infer_typeofadvanceWinnerRequestSchema_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BracketSlotNode": {
        "dataType": "refObject",
        "properties": {
            "slotId": { "dataType": "double", "required": true },
            "round": { "dataType": "double", "required": true },
            "slotNumber": { "dataType": "double", "required": true },
            "matchId": { "dataType": "union", "subSchemas": [{ "dataType": "double" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "isBye": { "dataType": "boolean", "required": true },
            "seededHomeTeamId": { "dataType": "union", "subSchemas": [{ "dataType": "double" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "seededAwayTeamId": { "dataType": "union", "subSchemas": [{ "dataType": "double" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "sourceASlotId": { "dataType": "union", "subSchemas": [{ "dataType": "double" }, { "dataType": "enum", "enums": [null] }], "required": true },
            "sourceBSlotId": { "dataType": "union", "subSchemas": [{ "dataType": "double" }, { "dataType": "enum", "enums": [null] }], "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GroupStatus": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["DRAFT"] }, { "dataType": "enum", "enums": ["LOCKED"] }, { "dataType": "enum", "enums": ["SCHEDULED"] }, { "dataType": "enum", "enums": ["SCHEDULE_FAILED"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DefaultSelection__36_GroupPayload_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "scheduleGeneratedAt": { "dataType": "datetime", "required": true }, "phase_id": { "dataType": "double", "required": true }, "status": { "ref": "GroupStatus", "required": true }, "updated_at": { "dataType": "datetime", "required": true }, "created_at": { "dataType": "datetime", "required": true }, "is_active": { "dataType": "boolean", "required": true }, "id": { "dataType": "double", "required": true }, "name": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GroupModel": {
        "dataType": "refAlias",
        "type": { "ref": "DefaultSelection__36_GroupPayload_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Group": {
        "dataType": "refAlias",
        "type": { "ref": "GroupModel", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GroupWithTeams": {
        "dataType": "refAlias",
        "type": { "dataType": "intersection", "subSchemas": [{ "ref": "Group" }, { "dataType": "nestedObjectLiteral", "nestedProperties": { "seasonTeams": { "dataType": "array", "array": { "dataType": "nestedObjectLiteral", "nestedProperties": { "team": { "dataType": "nestedObjectLiteral", "nestedProperties": { "logo": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }], "required": true }, "name": { "dataType": "string", "required": true }, "id": { "dataType": "double", "required": true } }, "required": true }, "status": { "dataType": "string", "required": true }, "id": { "dataType": "double", "required": true } } }, "required": true }, "phase": { "dataType": "nestedObjectLiteral", "nestedProperties": { "is_active": { "dataType": "boolean", "required": true }, "format": { "dataType": "string", "required": true }, "season_id": { "dataType": "double", "required": true }, "name": { "dataType": "string", "required": true }, "id": { "dataType": "double", "required": true } }, "required": true } } }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DrawAssignment": {
        "dataType": "refObject",
        "properties": {
            "group_id": { "dataType": "double", "required": true },
            "team_id": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DrawGroupsOptions": {
        "dataType": "refObject",
        "properties": {
            "teams_per_group": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AssignTeamToGroupBody": {
        "dataType": "refObject",
        "properties": {
            "season_team_id": { "dataType": "double", "required": true },
            "group_id": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SwapTeamsBody": {
        "dataType": "refObject",
        "properties": {
            "season_team_id_a": { "dataType": "double", "required": true },
            "season_team_id_b": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
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
    app.get('/users', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(UserController)), ...(fetchMiddlewares(UserController.prototype.findAll)), async function UserController_findAll(request, response, next) {
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
    app.get('/users/:id', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(UserController)), ...(fetchMiddlewares(UserController.prototype.findById)), async function UserController_findById(request, response, next) {
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
    app.post('/users', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(UserController)), ...(fetchMiddlewares(UserController.prototype.create)), async function UserController_create(request, response, next) {
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
    app.patch('/users/:id', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(UserController)), ...(fetchMiddlewares(UserController.prototype.update)), async function UserController_update(request, response, next) {
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
    app.delete('/users/:id', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(UserController)), ...(fetchMiddlewares(UserController.prototype.softDelete)), async function UserController_softDelete(request, response, next) {
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
    const argsSeasonTeamController_findAll = {
        page: { "default": 1, "in": "query", "name": "page", "dataType": "double" },
        per_page: { "default": 20, "in": "query", "name": "per_page", "dataType": "double" },
        q: { "in": "query", "name": "q", "dataType": "string" },
        sort: { "in": "query", "name": "sort", "dataType": "string" },
        direction: { "in": "query", "name": "direction", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["asc"] }, { "dataType": "enum", "enums": ["desc"] }] },
    };
    app.get('/seasonteams', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(SeasonTeamController)), ...(fetchMiddlewares(SeasonTeamController.prototype.findAll)), async function SeasonTeamController_findAll(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSeasonTeamController_findAll, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(SeasonTeamController);
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
    const argsSeasonTeamController_findById = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/seasonteams/:id', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(SeasonTeamController)), ...(fetchMiddlewares(SeasonTeamController.prototype.findById)), async function SeasonTeamController_findById(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSeasonTeamController_findById, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(SeasonTeamController);
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
    const argsSeasonTeamController_selfRegister = {
        body: { "in": "body", "name": "body", "required": true, "ref": "SelfRegisterSeasonTeamDto" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/seasonteams/register', authenticateMiddleware([{ "jwt": ["leader"] }]), ...(fetchMiddlewares(SeasonTeamController)), ...(fetchMiddlewares(SeasonTeamController.prototype.selfRegister)), async function SeasonTeamController_selfRegister(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSeasonTeamController_selfRegister, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(SeasonTeamController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'selfRegister',
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
    const argsSeasonTeamController_adminAdd = {
        body: { "in": "body", "name": "body", "required": true, "ref": "AdminAddSeasonTeamDto" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/seasonteams', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(SeasonTeamController)), ...(fetchMiddlewares(SeasonTeamController.prototype.adminAdd)), async function SeasonTeamController_adminAdd(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSeasonTeamController_adminAdd, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(SeasonTeamController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'adminAdd',
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
    const argsSeasonTeamController_updateStatus = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "UpdateSeasonTeamStatusDto" },
    };
    app.patch('/seasonteams/:id/status', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(SeasonTeamController)), ...(fetchMiddlewares(SeasonTeamController.prototype.updateStatus)), async function SeasonTeamController_updateStatus(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSeasonTeamController_updateStatus, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(SeasonTeamController);
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
    const argsSeasonTeamController_assignGroup = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "AssignGroupDto" },
    };
    app.patch('/seasonteams/:id/group', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(SeasonTeamController)), ...(fetchMiddlewares(SeasonTeamController.prototype.assignGroup)), async function SeasonTeamController_assignGroup(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSeasonTeamController_assignGroup, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(SeasonTeamController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'assignGroup',
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
    const argsSeasonTeamController_softDelete = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.delete('/seasonteams/:id', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(SeasonTeamController)), ...(fetchMiddlewares(SeasonTeamController.prototype.softDelete)), async function SeasonTeamController_softDelete(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSeasonTeamController_softDelete, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(SeasonTeamController);
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
    const argsSeasonController_listSeasons = {
        page: { "default": 1, "in": "query", "name": "page", "dataType": "double" },
        per_page: { "default": 20, "in": "query", "name": "per_page", "dataType": "double" },
        q: { "in": "query", "name": "q", "dataType": "string" },
        sort: { "in": "query", "name": "sort", "dataType": "string" },
        direction: { "in": "query", "name": "direction", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["asc"] }, { "dataType": "enum", "enums": ["desc"] }] },
        status: { "in": "query", "name": "status", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["ongoing"] }, { "dataType": "enum", "enums": ["finished"] }, { "dataType": "enum", "enums": ["cancelled"] }] },
        tournamentId: { "in": "query", "name": "tournamentId", "dataType": "double" },
    };
    app.get('/seasons', ...(fetchMiddlewares(SeasonController)), ...(fetchMiddlewares(SeasonController.prototype.listSeasons)), async function SeasonController_listSeasons(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSeasonController_listSeasons, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(SeasonController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'listSeasons',
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
    app.get('/seasons/:id', ...(fetchMiddlewares(SeasonController)), ...(fetchMiddlewares(SeasonController.prototype.findById)), async function SeasonController_findById(request, response, next) {
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
    app.post('/seasons', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(SeasonController)), ...(fetchMiddlewares(SeasonController.prototype.create)), async function SeasonController_create(request, response, next) {
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
    app.patch('/seasons/:id', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(SeasonController)), ...(fetchMiddlewares(SeasonController.prototype.update)), async function SeasonController_update(request, response, next) {
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
    app.delete('/seasons/:id', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(SeasonController)), ...(fetchMiddlewares(SeasonController.prototype.softDelete)), async function SeasonController_softDelete(request, response, next) {
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
    app.patch('/seasons/:id/status', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(SeasonController)), ...(fetchMiddlewares(SeasonController.prototype.updateStatus)), async function SeasonController_updateStatus(request, response, next) {
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
    const argsSeasonController_getSeasonStandings = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/seasons/:id/standings', ...(fetchMiddlewares(SeasonController)), ...(fetchMiddlewares(SeasonController.prototype.getSeasonStandings)), async function SeasonController_getSeasonStandings(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSeasonController_getSeasonStandings, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(SeasonController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'getSeasonStandings',
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
    const argsSeasonController_getGroupStandings = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        groupId: { "in": "path", "name": "groupId", "required": true, "dataType": "double" },
        page: { "in": "query", "name": "page", "dataType": "double" },
        per_page: { "in": "query", "name": "per_page", "dataType": "double" },
        sort: { "in": "query", "name": "sort", "dataType": "string" },
        direction: { "in": "query", "name": "direction", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["asc"] }, { "dataType": "enum", "enums": ["desc"] }] },
    };
    app.get('/seasons/:id/standings/:groupId', ...(fetchMiddlewares(SeasonController)), ...(fetchMiddlewares(SeasonController.prototype.getGroupStandings)), async function SeasonController_getGroupStandings(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSeasonController_getGroupStandings, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(SeasonController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'getGroupStandings',
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
    const argsSeasonController_getPlayerStats = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        teamId: { "in": "query", "name": "teamId", "dataType": "double" },
        page: { "in": "query", "name": "page", "dataType": "double" },
        per_page: { "in": "query", "name": "per_page", "dataType": "double" },
        sort: { "in": "query", "name": "sort", "dataType": "string" },
        direction: { "in": "query", "name": "direction", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["asc"] }, { "dataType": "enum", "enums": ["desc"] }] },
    };
    app.get('/seasons/:id/player-stats', ...(fetchMiddlewares(SeasonController)), ...(fetchMiddlewares(SeasonController.prototype.getPlayerStats)), async function SeasonController_getPlayerStats(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSeasonController_getPlayerStats, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(SeasonController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'getPlayerStats',
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
    const argsSeasonController_getSuspendedPlayers = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/seasons/:id/suspended-players', ...(fetchMiddlewares(SeasonController)), ...(fetchMiddlewares(SeasonController.prototype.getSuspendedPlayers)), async function SeasonController_getSuspendedPlayers(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSeasonController_getSuspendedPlayers, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(SeasonController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'getSuspendedPlayers',
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
    const argsScheduleController_generateSchedule = {
        seasonId: { "in": "path", "name": "seasonId", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "GenerateScheduleDto" },
    };
    app.post('/schedules/seasons/:seasonId/generate', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(ScheduleController)), ...(fetchMiddlewares(ScheduleController.prototype.generateSchedule)), async function ScheduleController_generateSchedule(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsScheduleController_generateSchedule, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(ScheduleController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'generateSchedule',
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
    const argsScheduleController_autoSchedule = {
        seasonId: { "in": "path", "name": "seasonId", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "AutoScheduleDto" },
    };
    app.post('/schedules/seasons/:seasonId/schedule', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(ScheduleController)), ...(fetchMiddlewares(ScheduleController.prototype.autoSchedule)), async function ScheduleController_autoSchedule(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsScheduleController_autoSchedule, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(ScheduleController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'autoSchedule',
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
    const argsScheduleController_rescheduleMatch = {
        matchId: { "in": "path", "name": "matchId", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "RescheduleMatchDto" },
    };
    app.patch('/schedules/matches/:matchId/reschedule', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(ScheduleController)), ...(fetchMiddlewares(ScheduleController.prototype.rescheduleMatch)), async function ScheduleController_rescheduleMatch(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsScheduleController_rescheduleMatch, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(ScheduleController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'rescheduleMatch',
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
    const argsScheduleController_getSchedule = {
        seasonId: { "in": "path", "name": "seasonId", "required": true, "dataType": "double" },
        page: { "default": 1, "in": "query", "name": "page", "dataType": "double" },
        per_page: { "default": 20, "in": "query", "name": "per_page", "dataType": "double" },
        sort: { "in": "query", "name": "sort", "dataType": "string" },
        direction: { "in": "query", "name": "direction", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["asc"] }, { "dataType": "enum", "enums": ["desc"] }] },
    };
    app.get('/schedules/seasons/:seasonId/schedule', ...(fetchMiddlewares(ScheduleController)), ...(fetchMiddlewares(ScheduleController.prototype.getSchedule)), async function ScheduleController_getSchedule(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsScheduleController_getSchedule, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(ScheduleController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'getSchedule',
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
    const argsScheduleController_getTeamSchedule = {
        seasonId: { "in": "path", "name": "seasonId", "required": true, "dataType": "double" },
        teamId: { "in": "path", "name": "teamId", "required": true, "dataType": "double" },
        page: { "default": 1, "in": "query", "name": "page", "dataType": "double" },
        per_page: { "default": 20, "in": "query", "name": "per_page", "dataType": "double" },
        sort: { "in": "query", "name": "sort", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["round"] }, { "dataType": "enum", "enums": ["scheduled_at"] }] },
        direction: { "in": "query", "name": "direction", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["asc"] }, { "dataType": "enum", "enums": ["desc"] }] },
    };
    app.get('/schedules/seasons/:seasonId/teams/:teamId/schedule', ...(fetchMiddlewares(ScheduleController)), ...(fetchMiddlewares(ScheduleController.prototype.getTeamSchedule)), async function ScheduleController_getTeamSchedule(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsScheduleController_getTeamSchedule, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(ScheduleController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'getTeamSchedule',
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
    app.get('/roles', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(RoleController)), ...(fetchMiddlewares(RoleController.prototype.findAll)), async function RoleController_findAll(request, response, next) {
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
    app.get('/roles/:id', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(RoleController)), ...(fetchMiddlewares(RoleController.prototype.findById)), async function RoleController_findById(request, response, next) {
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
    app.post('/roles', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(RoleController)), ...(fetchMiddlewares(RoleController.prototype.create)), async function RoleController_create(request, response, next) {
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
    app.patch('/roles/:id', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(RoleController)), ...(fetchMiddlewares(RoleController.prototype.update)), async function RoleController_update(request, response, next) {
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
    app.delete('/roles/:id', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(RoleController)), ...(fetchMiddlewares(RoleController.prototype.softDelete)), async function RoleController_softDelete(request, response, next) {
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
    const argsPlayerController_findById = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/players/:id', authenticateMiddleware([{ "jwt": ["admin", "user", "organizing", "guest"] }]), ...(fetchMiddlewares(PlayerController)), ...(fetchMiddlewares(PlayerController.prototype.findById)), async function PlayerController_findById(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsPlayerController_findById, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(PlayerController);
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
    const argsPlayerController_create = {
        body: { "in": "body", "name": "body", "required": true, "ref": "CreatePlayerDto" },
    };
    app.post('/players', authenticateMiddleware([{ "jwt": ["admin", "user", "organizing", "guest"] }]), ...(fetchMiddlewares(PlayerController)), ...(fetchMiddlewares(PlayerController.prototype.create)), async function PlayerController_create(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsPlayerController_create, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(PlayerController);
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
    const argsPlayerController_update = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "UpdatePlayerDto" },
    };
    app.patch('/players/:id', authenticateMiddleware([{ "jwt": ["admin", "user", "organizing", "guest"] }]), ...(fetchMiddlewares(PlayerController)), ...(fetchMiddlewares(PlayerController.prototype.update)), async function PlayerController_update(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsPlayerController_update, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(PlayerController);
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
    const argsPlayerController_softDelete = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.delete('/players/:id', authenticateMiddleware([{ "jwt": ["admin", "user", "organizing", "guest"] }]), ...(fetchMiddlewares(PlayerController)), ...(fetchMiddlewares(PlayerController.prototype.softDelete)), async function PlayerController_softDelete(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsPlayerController_softDelete, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(PlayerController);
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
    const argsPlayerController_listTeamPlayers = {
        team_id: { "in": "path", "name": "team_id", "required": true, "dataType": "double" },
        page: { "default": 1, "in": "query", "name": "page", "dataType": "double" },
        per_page: { "default": 20, "in": "query", "name": "per_page", "dataType": "double" },
        sort: { "in": "query", "name": "sort", "dataType": "string" },
        direction: { "in": "query", "name": "direction", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["asc"] }, { "dataType": "enum", "enums": ["desc"] }] },
        position: { "in": "query", "name": "position", "dataType": "string" },
        status: { "in": "query", "name": "status", "dataType": "string" },
        approval_status: { "in": "query", "name": "approval_status", "dataType": "string" },
    };
    app.get('/players/:team_id/team-players', authenticateMiddleware([{ "jwt": ["admin", "user", "organizing", "guest"] }]), ...(fetchMiddlewares(PlayerController)), ...(fetchMiddlewares(PlayerController.prototype.listTeamPlayers)), async function PlayerController_listTeamPlayers(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsPlayerController_listTeamPlayers, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(PlayerController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'listTeamPlayers',
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
    const argsPlayerController_getTeamPlayer = {
        team_id: { "in": "path", "name": "team_id", "required": true, "dataType": "double" },
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/players/:team_id/team-players/:id', authenticateMiddleware([{ "jwt": ["admin", "user", "organizing", "guest"] }]), ...(fetchMiddlewares(PlayerController)), ...(fetchMiddlewares(PlayerController.prototype.getTeamPlayer)), async function PlayerController_getTeamPlayer(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsPlayerController_getTeamPlayer, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(PlayerController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'getTeamPlayer',
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
    const argsPlayerController_addPlayerToTeam = {
        team_id: { "in": "path", "name": "team_id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "AddPlayerToTeamDto" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/players/:team_id/team-players', authenticateMiddleware([{ "jwt": ["admin", "user", "organizing", "guest"] }]), ...(fetchMiddlewares(PlayerController)), ...(fetchMiddlewares(PlayerController.prototype.addPlayerToTeam)), async function PlayerController_addPlayerToTeam(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsPlayerController_addPlayerToTeam, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(PlayerController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'addPlayerToTeam',
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
    const argsPlayerController_updateTeamPlayer = {
        team_id: { "in": "path", "name": "team_id", "required": true, "dataType": "double" },
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "UpdateTeamPlayerDto" },
    };
    app.patch('/players/:team_id/team-players/:id', authenticateMiddleware([{ "jwt": ["admin", "user", "organizing", "guest"] }]), ...(fetchMiddlewares(PlayerController)), ...(fetchMiddlewares(PlayerController.prototype.updateTeamPlayer)), async function PlayerController_updateTeamPlayer(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsPlayerController_updateTeamPlayer, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(PlayerController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'updateTeamPlayer',
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
    const argsPlayerController_approveTeamPlayer = {
        team_id: { "in": "path", "name": "team_id", "required": true, "dataType": "double" },
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.post('/players/:team_id/team-players/:id/approve', authenticateMiddleware([{ "jwt": ["admin", "user", "organizing", "guest"] }]), ...(fetchMiddlewares(PlayerController)), ...(fetchMiddlewares(PlayerController.prototype.approveTeamPlayer)), async function PlayerController_approveTeamPlayer(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsPlayerController_approveTeamPlayer, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(PlayerController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'approveTeamPlayer',
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
    const argsPlayerController_rejectTeamPlayer = {
        team_id: { "in": "path", "name": "team_id", "required": true, "dataType": "double" },
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.post('/players/:team_id/team-players/:id/reject', authenticateMiddleware([{ "jwt": ["admin", "user", "organizing", "guest"] }]), ...(fetchMiddlewares(PlayerController)), ...(fetchMiddlewares(PlayerController.prototype.rejectTeamPlayer)), async function PlayerController_rejectTeamPlayer(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsPlayerController_rejectTeamPlayer, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(PlayerController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'rejectTeamPlayer',
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
    const argsPlayerController_bulkDeleteTeamPlayers = {
        team_id: { "in": "path", "name": "team_id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "BulkDeleteDto" },
    };
    app.delete('/players/:team_id/team-players', authenticateMiddleware([{ "jwt": ["admin", "user", "organizing", "guest"] }]), ...(fetchMiddlewares(PlayerController)), ...(fetchMiddlewares(PlayerController.prototype.bulkDeleteTeamPlayers)), async function PlayerController_bulkDeleteTeamPlayers(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsPlayerController_bulkDeleteTeamPlayers, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(PlayerController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'bulkDeleteTeamPlayers',
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
    const argsPlayerController_exportTeamPlayers = {
        team_id: { "in": "path", "name": "team_id", "required": true, "dataType": "double" },
    };
    app.get('/players/:team_id/team-players/export', authenticateMiddleware([{ "jwt": ["admin", "user", "organizing", "guest"] }]), ...(fetchMiddlewares(PlayerController)), ...(fetchMiddlewares(PlayerController.prototype.exportTeamPlayers)), async function PlayerController_exportTeamPlayers(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsPlayerController_exportTeamPlayers, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(PlayerController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'exportTeamPlayers',
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
    const argsPlayerController_downloadImportTemplate = {};
    app.get('/players/import-template', authenticateMiddleware([{ "jwt": ["admin", "user", "organizing", "guest"] }]), ...(fetchMiddlewares(PlayerController)), ...(fetchMiddlewares(PlayerController.prototype.downloadImportTemplate)), async function PlayerController_downloadImportTemplate(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsPlayerController_downloadImportTemplate, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(PlayerController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'downloadImportTemplate',
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
    const argsMatchResultController_getMatchResult = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/matches/:id/result', ...(fetchMiddlewares(MatchResultController)), ...(fetchMiddlewares(MatchResultController.prototype.getMatchResult)), async function MatchResultController_getMatchResult(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsMatchResultController_getMatchResult, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(MatchResultController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'getMatchResult',
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
    const argsMatchResultController_getMatchEvents = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        type: { "in": "query", "name": "type", "dataType": "string" },
        period: { "in": "query", "name": "period", "dataType": "string" },
        page: { "in": "query", "name": "page", "dataType": "double" },
        per_page: { "in": "query", "name": "per_page", "dataType": "double" },
        sort: { "in": "query", "name": "sort", "dataType": "string" },
        direction: { "in": "query", "name": "direction", "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["asc"] }, { "dataType": "enum", "enums": ["desc"] }] },
        q: { "in": "query", "name": "q", "dataType": "string" },
    };
    app.get('/matches/:id/events', ...(fetchMiddlewares(MatchResultController)), ...(fetchMiddlewares(MatchResultController.prototype.getMatchEvents)), async function MatchResultController_getMatchEvents(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsMatchResultController_getMatchEvents, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(MatchResultController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'getMatchEvents',
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
    const argsMatchResultController_getMatchPlayerStats = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/matches/:id/result/stats', ...(fetchMiddlewares(MatchResultController)), ...(fetchMiddlewares(MatchResultController.prototype.getMatchPlayerStats)), async function MatchResultController_getMatchPlayerStats(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsMatchResultController_getMatchPlayerStats, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(MatchResultController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'getMatchPlayerStats',
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
    const argsMatchResultController_confirmResult = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "ConfirmOfficialBody" },
    };
    app.post('/matches/:id/result/confirm', authenticateMiddleware([{ "jwt": [] }]), ...(fetchMiddlewares(MatchResultController)), ...(fetchMiddlewares(MatchResultController.prototype.confirmResult)), async function MatchResultController_confirmResult(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsMatchResultController_confirmResult, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(MatchResultController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'confirmResult',
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
    const argsMatchController_startMatch = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.post('/matches/:id/start', authenticateMiddleware([{ "jwt": ["organizing", "admin"] }]), ...(fetchMiddlewares(MatchController)), ...(fetchMiddlewares(MatchController.prototype.startMatch)), async function MatchController_startMatch(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsMatchController_startMatch, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(MatchController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'startMatch',
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
    const argsMatchController_transitionPeriod = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "TransitionPeriodDto" },
    };
    app.post('/matches/:id/period', authenticateMiddleware([{ "jwt": ["organizing", "admin"] }]), ...(fetchMiddlewares(MatchController)), ...(fetchMiddlewares(MatchController.prototype.transitionPeriod)), async function MatchController_transitionPeriod(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsMatchController_transitionPeriod, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(MatchController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'transitionPeriod',
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
    const argsMatchController_recordEvent = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "RecordEventInput" },
    };
    app.post('/matches/:id/events', authenticateMiddleware([{ "jwt": ["organizing", "admin"] }]), ...(fetchMiddlewares(MatchController)), ...(fetchMiddlewares(MatchController.prototype.recordEvent)), async function MatchController_recordEvent(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsMatchController_recordEvent, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(MatchController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'recordEvent',
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
    const argsMatchController_finalizeMatch = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "FinalizeMatchDto" },
    };
    app.post('/matches/:id/finalize', authenticateMiddleware([{ "jwt": ["organizing", "admin"] }]), ...(fetchMiddlewares(MatchController)), ...(fetchMiddlewares(MatchController.prototype.finalizeMatch)), async function MatchController_finalizeMatch(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsMatchController_finalizeMatch, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(MatchController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'finalizeMatch',
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
    const argsMatchController_submitManualScore = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "ManualScoreDto" },
    };
    app.post('/matches/:id/manual-score', authenticateMiddleware([{ "jwt": ["organizing", "admin"] }]), ...(fetchMiddlewares(MatchController)), ...(fetchMiddlewares(MatchController.prototype.submitManualScore)), async function MatchController_submitManualScore(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsMatchController_submitManualScore, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(MatchController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'submitManualScore',
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
    const argsMatchController_confirmOfficial = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "ConfirmOfficialDto" },
    };
    app.post('/matches/:id/confirm', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(MatchController)), ...(fetchMiddlewares(MatchController.prototype.confirmOfficial)), async function MatchController_confirmOfficial(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsMatchController_confirmOfficial, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(MatchController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'confirmOfficial',
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
    const argsMatchController_forfeitMatch = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "ForfeitMatchDto" },
    };
    app.post('/matches/:id/forfeit', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(MatchController)), ...(fetchMiddlewares(MatchController.prototype.forfeitMatch)), async function MatchController_forfeitMatch(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsMatchController_forfeitMatch, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(MatchController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'forfeitMatch',
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
    const argsMatchController_abandonMatch = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "AbandonMatchDto" },
    };
    app.post('/matches/:id/abandon', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(MatchController)), ...(fetchMiddlewares(MatchController.prototype.abandonMatch)), async function MatchController_abandonMatch(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsMatchController_abandonMatch, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(MatchController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'abandonMatch',
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
    const argsMatchController_fileAppeal = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "FileDisputeDto" },
    };
    app.post('/matches/:id/appeal', authenticateMiddleware([{ "jwt": ["admin", "organizing", "user", "leader"] }]), ...(fetchMiddlewares(MatchController)), ...(fetchMiddlewares(MatchController.prototype.fileAppeal)), async function MatchController_fileAppeal(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsMatchController_fileAppeal, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(MatchController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'fileAppeal',
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
    const argsMatchController_fileProtest = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "FileDisputeDto" },
    };
    app.post('/matches/:id/protest', authenticateMiddleware([{ "jwt": ["admin", "organizing", "user", "leader"] }]), ...(fetchMiddlewares(MatchController)), ...(fetchMiddlewares(MatchController.prototype.fileProtest)), async function MatchController_fileProtest(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsMatchController_fileProtest, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(MatchController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'fileProtest',
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
    const argsMatchController_resolveAppeal = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "ResolveAppealDto" },
    };
    app.post('/matches/:id/resolve-appeal', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(MatchController)), ...(fetchMiddlewares(MatchController.prototype.resolveAppeal)), async function MatchController_resolveAppeal(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsMatchController_resolveAppeal, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(MatchController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'resolveAppeal',
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
    const argsMatchController_addEvent = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "dataType": "intersection", "subSchemas": [{ "ref": "AddEventInput" }, { "ref": "ConfirmOfficialDto" }] },
    };
    app.post('/matches/:id/correction/events', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(MatchController)), ...(fetchMiddlewares(MatchController.prototype.addEvent)), async function MatchController_addEvent(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsMatchController_addEvent, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(MatchController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'addEvent',
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
    const argsMatchController_deleteEvent = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        eventId: { "in": "path", "name": "eventId", "required": true, "dataType": "double" },
        venueIds: { "in": "query", "name": "venueIds", "dataType": "string" },
        matchTimes: { "in": "query", "name": "matchTimes", "dataType": "string" },
    };
    app.delete('/matches/:id/correction/events/:eventId', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(MatchController)), ...(fetchMiddlewares(MatchController.prototype.deleteEvent)), async function MatchController_deleteEvent(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsMatchController_deleteEvent, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(MatchController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'deleteEvent',
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
    const argsMatchController_editEvent = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        eventId: { "in": "path", "name": "eventId", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "dataType": "intersection", "subSchemas": [{ "ref": "EditEventInput" }, { "ref": "ConfirmOfficialDto" }] },
    };
    app.patch('/matches/:id/correction/events/:eventId', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(MatchController)), ...(fetchMiddlewares(MatchController.prototype.editEvent)), async function MatchController_editEvent(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsMatchController_editEvent, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(MatchController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'editEvent',
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
    const argsMatchController_editScore = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "dataType": "intersection", "subSchemas": [{ "ref": "EditScoreInput" }, { "ref": "ConfirmOfficialDto" }] },
    };
    app.patch('/matches/:id/correction/score', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(MatchController)), ...(fetchMiddlewares(MatchController.prototype.editScore)), async function MatchController_editScore(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsMatchController_editScore, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(MatchController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'editScore',
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
    const argsKnockoutController_generateKnockoutBracket = {
        seasonId: { "in": "path", "name": "seasonId", "required": true, "dataType": "double" },
        phaseId: { "in": "path", "name": "phaseId", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "GenerateKnockoutRequestDto" },
    };
    app.post('/seasons/:seasonId/phases/:phaseId/knockout/generate', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(KnockoutController)), ...(fetchMiddlewares(KnockoutController.prototype.generateKnockoutBracket)), async function KnockoutController_generateKnockoutBracket(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsKnockoutController_generateKnockoutBracket, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(KnockoutController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'generateKnockoutBracket',
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
    const argsKnockoutController_advanceWinner = {
        seasonId: { "in": "path", "name": "seasonId", "required": true, "dataType": "double" },
        phaseId: { "in": "path", "name": "phaseId", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "AdvanceWinnerRequestDto" },
    };
    app.post('/seasons/:seasonId/phases/:phaseId/knockout/advance', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(KnockoutController)), ...(fetchMiddlewares(KnockoutController.prototype.advanceWinner)), async function KnockoutController_advanceWinner(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsKnockoutController_advanceWinner, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(KnockoutController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'advanceWinner',
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
    const argsKnockoutController_getBracket = {
        phaseId: { "in": "path", "name": "phaseId", "required": true, "dataType": "double" },
    };
    app.get('/phases/:phaseId/knockout/bracket', ...(fetchMiddlewares(KnockoutController)), ...(fetchMiddlewares(KnockoutController.prototype.getBracket)), async function KnockoutController_getBracket(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsKnockoutController_getBracket, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(KnockoutController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'getBracket',
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
    const argsGroupController_findByIdWithTeams = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/groups/:id', ...(fetchMiddlewares(GroupController)), ...(fetchMiddlewares(GroupController.prototype.findByIdWithTeams)), async function GroupController_findByIdWithTeams(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsGroupController_findByIdWithTeams, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(GroupController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'findByIdWithTeams',
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
    const argsGroupController_drawGroups = {
        phaseId: { "in": "path", "name": "phaseId", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "DrawGroupsOptions" },
    };
    app.post('/groups/:phaseId/draw', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(GroupController)), ...(fetchMiddlewares(GroupController.prototype.drawGroups)), async function GroupController_drawGroups(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsGroupController_drawGroups, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(GroupController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'drawGroups',
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
    const argsGroupController_drawGroupsSeeded = {
        phaseId: { "in": "path", "name": "phaseId", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "dataType": "intersection", "subSchemas": [{ "ref": "DrawGroupsOptions" }, { "dataType": "nestedObjectLiteral", "nestedProperties": { "num_pots": { "dataType": "double", "required": true } } }] },
    };
    app.post('/groups/:phaseId/draw/seeded', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(GroupController)), ...(fetchMiddlewares(GroupController.prototype.drawGroupsSeeded)), async function GroupController_drawGroupsSeeded(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsGroupController_drawGroupsSeeded, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(GroupController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'drawGroupsSeeded',
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
    const argsGroupController_clearDraw = {
        phaseId: { "in": "path", "name": "phaseId", "required": true, "dataType": "double" },
    };
    app.delete('/groups/:phaseId/draw', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(GroupController)), ...(fetchMiddlewares(GroupController.prototype.clearDraw)), async function GroupController_clearDraw(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsGroupController_clearDraw, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(GroupController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'clearDraw',
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
    const argsGroupController_assignTeamToGroup = {
        body: { "in": "body", "name": "body", "required": true, "ref": "AssignTeamToGroupBody" },
    };
    app.put('/groups/assign', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(GroupController)), ...(fetchMiddlewares(GroupController.prototype.assignTeamToGroup)), async function GroupController_assignTeamToGroup(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsGroupController_assignTeamToGroup, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(GroupController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'assignTeamToGroup',
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
    const argsGroupController_swapTeams = {
        body: { "in": "body", "name": "body", "required": true, "ref": "SwapTeamsBody" },
    };
    app.put('/groups/swap', authenticateMiddleware([{ "jwt": ["admin"] }]), ...(fetchMiddlewares(GroupController)), ...(fetchMiddlewares(GroupController.prototype.swapTeams)), async function GroupController_swapTeams(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsGroupController_swapTeams, request, response });
            const container = typeof iocContainer === 'function' ? iocContainer(request) : iocContainer;
            const controller = await container.get(GroupController);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            await templateService.apiHandler({
                methodName: 'swapTeams',
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