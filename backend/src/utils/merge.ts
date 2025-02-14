import { In } from "typeorm";
import { IdInput } from "../entities/id";
import { Tag } from "../entities/Tag"; // Import de la classe Tag

export async function merge(entity: any, data: any): Promise<any> {
    for (const [key, value] of Object.entries(data)) {
        // Vérifie si la valeur est une liste d'instances de IdInput
        if (Array.isArray(value) && value.length > 0 && value[0] instanceof IdInput) {
            if (!(key in entity)) {
                throw new Error(`Missing key ${key} in your entity, did you forget to fetch your relation?`);
            }

            // Récupère les ids des relations
            const ids = value.map((entry: IdInput) => entry.id);

            // Détermine la classe de l'entité liée (utilise explicitement Tag si la relation n'est pas initialisée)
            const relatedEntityClass = entity[key][0]?.constructor || Tag;

            if (!relatedEntityClass) {
                throw new Error(`Unable to determine the related entity class for key: ${key}`);
            }

            // Récupère les instances des entités liées
            const relatedEntities = await relatedEntityClass.findBy({ id: In(ids) });

            // Remplace la relation par les instances récupérées
            data[key] = relatedEntities;
        }
    }

    // Applique les données à l'entité
    Object.assign(entity, data);
    return entity;
}
