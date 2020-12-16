import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

import { Pokemon, allPokemon } from "../../data/pokemon";

const findByName = (name: string): Pokemon => {
  const normalized = name.toLowerCase();

  return allPokemon.find(
    (pokemon) => pokemon.name.toLowerCase() === normalized
  );
};

const findById = (id: string): Pokemon => {
  const normalized = Number.parseInt(id, 10);

  return allPokemon.find((pokemon) => pokemon.id === normalized);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const [idOrName] = req.query.idOrName;

  try {
    if (idOrName.startsWith("-")) {
      throw new Error("invalid id or name");
    }

    if (idOrName === "all") {
      res.json(allPokemon);
      return;
    }

    const isName = Number.isNaN(Number.parseInt(idOrName, 10));
    const pokemon = isName ? findByName(idOrName) : findById(idOrName);

    res.setHeader("Expires", new Date(Date.now() + 600).toUTCString());

    res.json(pokemon);
  } catch (error) {
    res.json({
      error:
        error instanceof Error
          ? `${error.name}: ${error.message}`
          : "unknown error",
    });
  }
};

// eslint-disable-next-line import/no-default-export
export default nextConnect().get(handler);
