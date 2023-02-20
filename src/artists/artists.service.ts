import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { db } from 'src/dataBase/db';
import { DeleteResult, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { ArtistEntities } from './entities/artist.entities';

const uuidValid = (uuid: string): boolean => uuidValidate(uuid);

@Injectable()
export class ArtistsService {
	constructor(
		@InjectRepository(ArtistEntities)
		private artistRepository: Repository<ArtistEntities>,
	 ) {}

  async getAll() {
	return await this.artistRepository.find();
  }

  getById(id: string) {
    const valide = uuidValid(id);
    if (!valide) throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    const findArtist = this.artistRepository.findOne({ where: { id: id } });
    if (!findArtist) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    return findArtist;
  }

  async create(artistDto: CreateArtistDto) {
    const { name, grammy } = artistDto;
    if (typeof name === 'string' && typeof grammy === 'boolean') {
		 const newArtist = new ArtistEntities
		 Object.assign(newArtist, artistDto);
		 return (await this.artistRepository.save(newArtist))
      
    } else {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, artistDto: CreateArtistDto) {
	const findArtist = await this.artistRepository.findOne({ where: { id: id } });
	if (findArtist) {
	  Object.assign(findArtist, artistDto);
	  return await this.artistRepository.save(findArtist);
	} else {
		throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
	}
  }

  async delete(id: string): Promise<DeleteResult> {
    const valide = uuidValid(id);
    if (!valide) throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    
	 return await this.artistRepository.delete(id);
	 
  }
}
