/**
 * FastAPI
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Commit } from './commit';
import { CommitStats } from './commitStats';


export interface CommitDetails { 
    sha: any | null;
    commit: Commit;
    stats: CommitStats;
    files: any | null;
}

